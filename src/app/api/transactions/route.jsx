import { parse, format } from "date-fns";

// Get threshold from environment variable with 0.8 fallback
const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.8');
// Get API base URL from environment variable with fallback
const API_BASE_URL = process.env.API_BASE_URL || 'http://139.59.195.72:8080';

export async function GET() {
  const endpoint = `${API_BASE_URL}/transactions`;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    // Map the fetched data to match the required structure
    const transactions = data.map((item) => ({
      id: item.sessionid || "N/A",
      time: item.createdat || "N/A",
      owner: item.dg11.fullname || "Unknown Owner",
      number: item.dg1.documentnumber || "Unknown",
      expiry: item.dg1.dateofexpiry ? format((parse(item.dg1.dateofexpiry, "ddMMyy", new Date())),"dd-MMM-yyyy") : "N/A",
      nationality: item.dg1.nationality || "Unknown",
      similarity: item.simililarity || 0,
      status: (item.simililarity >= SIMILARITY_THRESHOLD && (item.live !== false)) ? "Verified" : "Failed",
    }));

    for (const transaction of transactions) {
      console.log(`Transaction ID: ${transaction.id}, Status: ${transaction.status}, Similarity: ${transaction.similarity}, Raw: ${data.find(d => d.sessionid === transaction.id)?.simililarity}`);
    }

    return new Response(JSON.stringify(transactions), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
