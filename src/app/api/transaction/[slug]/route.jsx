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
  const endpoint = `http://188.166.205.153:8080/transactions/${transactionId}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Convert JP2 to JPEG via PNG
    let convertedFaceImage = null;
    if (data.dg2?.faceimages?.[0]?.imagebase64) {
      try {
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
      } catch (imageError) {
        console.error('Image conversion failed:', imageError);
        convertedFaceImage = data.dg2.faceimages[0].imagebase64;
      }
    }

    console.log("Heol", data.createdat)

    const mappedTransaction = {
      id: transactionId,
      time: data.createdat,
      sourceIP: "203.0.113.1",
      owner: data.dg11.fullname || "Unknown Owner",
      type: ["OCR", "NFC", "QR"][Math.floor(Math.random() * 3)],
      status: ["Completed", "Failed", "Pending"][Math.floor(Math.random() * 3)],
      fullName: data.dg11.fullname || "Unknown",
      idNumber: data.dg1.documentnumber || "N/A",
      nationality: data.dg1.nationality || "N/A",
      address: data.dg12.additionaldetails || "Unknown Address",
      birthdate: format((parse(data.dg1.dateofbirth, "yyMMdd", new Date())),"dd-MMM-yyyy") || "Unknown Birthdate",
      occupation: data.dg11.profession || "Unknown Occupation",
      idType: data.dg1.documentcode || "Unknown ID Type",
      expiryDate: format((parse(data.dg1.dateofexpiry, "yyMMdd", new Date())),"dd-MMM-yyyy"),
      issuanceDate: "Unknown Issuance Date",
      faceImageBase64: convertedFaceImage,
    };

    return new Response(JSON.stringify(mappedTransaction), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}