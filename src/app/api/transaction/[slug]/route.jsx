import { parse, format } from "date-fns";
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

// Get threshold from environment variable with 0.8 fallback
const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.8');
// Get API base URL from environment variable with fallback
const API_BASE_URL = process.env.API_BASE_URL || 'http://139.59.195.72:8080';

// Function to parse passport dates with proper year handling
function toFourDigitYear(yy, pivot = 69) {
  return yy >= pivot ? 1900 + yy : 2000 + yy;
}

function parsePassportDate(dateString, formatStr, opts = {}) {
  if (!dateString) return null;

  // Allow overriding the pivot or forcing 2000-century (useful for expiry)
  const { pivot = 69, force2000ForExpiry = false, field } = opts;

  if (formatStr === "yyMMdd") {
    const yy = parseInt(dateString.substring(0, 2), 10);
    const mm = dateString.substring(2, 4);
    const dd = dateString.substring(4, 6);

    let fullYear;
    if (force2000ForExpiry || field === "expiry") {
      // Many passports have ≤10-year validity; mapping to 20xx is usually correct.
      fullYear = 2000 + yy;
    } else {
      // Generic/DOB behavior with a sensible pivot (69 by default).
      fullYear = toFourDigitYear(yy, pivot);
    }

    return parse(`${fullYear}${mm}${dd}`, "yyyyMMdd", new Date());
  }

  return parse(dateString, formatStr, new Date());
}

export async function GET(req, { params }) {
  if (!params || !params.slug) {
    return new Response(
      JSON.stringify({ message: "Missing transaction ID in params" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const transactionId = params.slug;
  const endpoint = `${API_BASE_URL}/transactions/${transactionId}`;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Convert JP2 to JPEG via PNG for both passport and selfie images
    let convertedPassportImage = null;
    let convertedSelfieImage = null;
    
    // Process Element 0 of DG2 (Passport Image)
    if (data.dg2?.faceimages?.[0]?.imagebase64) {
      try {
        const imageBuffer = Buffer.from(data.dg2.faceimages[0].imagebase64, 'base64');
        
        // Try Sharp direct conversion first (supports JP2 with libvips)
        try {
          const jpegBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 90 })
            .toBuffer();
          convertedPassportImage = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
        } catch (sharpError) {
          // Fallback to opj_decompress method
          const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jp2-conversion-passport-'));
          const inputPath = path.join(tempDir, 'input.jp2');
          const pngPath = path.join(tempDir, 'output.png');

          await fs.writeFile(inputPath, imageBuffer);

          await execFileAsync('opj_decompress', [
            '-i', inputPath,
            '-o', pngPath
          ]);

          const pngBuffer = await fs.readFile(pngPath);
          const jpegBuffer = await sharp(pngBuffer)
            .jpeg({ quality: 90 })
            .toBuffer();

          convertedPassportImage = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
          await fs.rm(tempDir, { recursive: true });
        }
      } catch (error) {
        console.error('Passport image conversion failed:', error);
        convertedPassportImage = `data:image/jpeg;base64,${data.dg2.faceimages[0].imagebase64}`;
      }
    }

    // Process Element 1 of DG2 (Selfie Image)
    if (data.dg2?.faceimages?.[1]?.imagebase64) {
      try {
        const imageBuffer = Buffer.from(data.dg2.faceimages[1].imagebase64, 'base64');
        
        // Try Sharp direct conversion first (supports JP2 with libvips)
        try {
          const jpegBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 90 })
            .toBuffer();
          convertedSelfieImage = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
        } catch (sharpError) {
          // Fallback to opj_decompress method
          const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jp2-conversion-selfie-'));
          const inputPath = path.join(tempDir, 'input.jp2');
          const pngPath = path.join(tempDir, 'output.png');

          await fs.writeFile(inputPath, imageBuffer);

          await execFileAsync('opj_decompress', [
            '-i', inputPath,
            '-o', pngPath
          ]);

          const pngBuffer = await fs.readFile(pngPath);
          const jpegBuffer = await sharp(pngBuffer)
            .jpeg({ quality: 90 })
            .toBuffer();

          convertedSelfieImage = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
          await fs.rm(tempDir, { recursive: true });
        }
      } catch (error) {
        console.error('Selfie image conversion failed:', error);
        convertedSelfieImage = `data:image/jpeg;base64,${data.dg2.faceimages[1].imagebase64}`;
      }
    }

    console.log(data)


    const mappedTransaction = {
      id: transactionId || "Unknown ID",
      time: data.createdat || "Unknown Time",
      sourceIP: "203.0.113.1",
      owner: data.dg11?.fullname || "Unknown Owner",
      type: ["OCR", "NFC", "QR"][Math.floor(Math.random() * 3)],
      status: (data.simililarity >= SIMILARITY_THRESHOLD && (data.live !== false)) ? "Verified" : "Failed",
      fullName: data.dg11?.fullname || "Unknown",
      idNumber: data.dg1?.documentnumber || "N/A",
      nationality: data.dg1?.nationality || "N/A",
      gender: data.dg1?.gender || "N/A",
      address: data.dg11?.permanentaddress[0] || "Unknown Address",
      birthdate: data.dg1?.dateofbirth ? format(parsePassportDate(data.dg1.dateofbirth, "yyMMdd"), "dd-MMM-yyyy") : "N/A",
      birthplace: data.dg11?.placeofbirth[0] || "N/A",
      occupation: data.dg11?.profession || "Unknown Occupation",
      idType: data.dg1?.documentcode || "Unknown ID Type",
      expiryDate: data.dg1?.dateofexpiry ? format(parsePassportDate(data.dg1.dateofexpiry, "yyMMdd"), "dd-MMM-yyyy") : "N/A",
      issuanceState: data.dg1?.issuingstate || "N/A",
      issuanceDate: data.dg12?.dateofissue ? format((parse(data.dg12.dateofissue, "yyyyMMdd", new Date())), "dd-MMM-yyyy") : "N/A",
      issuingAuthority: data.dg12?.issuingauthority || "N/A",
      faceImageBase64: convertedPassportImage || "N/A",
      selfieImageBase64: convertedSelfieImage || "N/A",
      faceRecognition: {
        confidence: data.simililarity || 0,
        matchStatus: data.simililarity >= SIMILARITY_THRESHOLD ? "Match" : "No Match",
        transaction: data.id || transactionId || "Unknown",
        live: data.live !== undefined ? data.live : true,
        livenessScore: data.livenessscore || data.liveness_score || 0,
      },
      // Security fields for SecurityView component (document security only)
      sod: data.sod || null,
    };

    return new Response(JSON.stringify(mappedTransaction), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}