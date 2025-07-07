import { parse, format } from "date-fns";
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

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
  const endpoint = `http://139.59.195.72:8080/transactions/${transactionId}`;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Convert JP2 to JPEG via PNG
    let convertedFaceImage = null;
    if (data.dg2?.faceimages?.[0]?.imagebase64) {
      try {
        // Check if opj_compress exists
        await execFileAsync('which', ['opj_compress']);

        // Create temporary files
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jp2-conversion-'));
        const inputPath = path.join(tempDir, 'input.jp2');
        const pngPath = path.join(tempDir, 'output.png');

        // Write JP2 data to temp file
        const imageBuffer = Buffer.from(data.dg2.faceimages[0].imagebase64, 'base64');
        await fs.writeFile(inputPath, imageBuffer);

        // Convert JP2 to PNG using opj_decompress
        await execFileAsync('opj_decompress', [
          '-i', inputPath,
          '-o', pngPath
        ]);

        // Read PNG and convert to JPEG using Sharp
        const pngBuffer = await fs.readFile(pngPath);
        const jpegBuffer = await sharp(pngBuffer)
          .jpeg({ quality: 90 })
          .toBuffer();

        convertedFaceImage = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;

        // Clean up temp files
        await fs.rm(tempDir, { recursive: true });
      } catch (error) {
        console.error('Image conversion or opj_compress check failed:', error);
        convertedFaceImage = `data:image/jpeg;base64,${data.dg2.faceimages[0].imagebase64}`;
      }
    }

    console.log(data)


    const mappedTransaction = {
      id: transactionId || "Unknown ID",
      time: data.createdat || "Unknown Time",
      sourceIP: "203.0.113.1",
      owner: data.dg11?.fullname || "Unknown Owner",
      type: ["OCR", "NFC", "QR"][Math.floor(Math.random() * 3)],
      status: "Completed"/* ["Completed", "Failed"][Math.floor(Math.random() * 2)] */,
      fullName: data.dg11?.fullname || "Unknown",
      idNumber: data.dg1?.documentnumber || "N/A",
      nationality: data.dg1?.nationality || "N/A",
      gender: data.dg1?.gender || "N/A",
      address: data.dg11?.permanentaddress[0] || "Unknown Address",
      birthdate: data.dg1?.dateofbirth ? format((parse(data.dg1.dateofbirth, "yyMMdd", new Date())), "dd-MMM-yyyy") : "N/A",
      birthplace: data.dg11?.placeofbirth[0] || "N/A",
      occupation: data.dg11?.profession || "Unknown Occupation",
      idType: data.dg1?.documentcode || "Unknown ID Type",
      expiryDate: data.dg1?.dateofexpiry ? format((parse(data.dg1.dateofexpiry, "yyMMdd", new Date())), "dd-MMM-yyyy") : "N/A",
      issuanceState: data.dg1?.issuingstate || "N/A",
      issuanceDate: data.dg12?.dateofissue ? format((parse(data.dg12.dateofissue, "yyyyMMdd", new Date())), "dd-MMM-yyyy") : "N/A",
      issuingAuthority: data.dg12?.issuingauthority || "N/A",
      faceImageBase64: convertedFaceImage || "N/A",
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