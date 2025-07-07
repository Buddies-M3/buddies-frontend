import { parse, format } from "date-fns";

export async function GET() {
  const endpoint = "http://139.59.195.72:8080/transactions";

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Map the fetched data to match the required structure
    const transactions = data.map((item) => ({
      id: item.sessionid || "N/A",
      time: item.createdat || "N/A",
      owner: item.dg11.fullname || "Unknown Owner",
      number: item.dg1.documentnumber || "Unknown",
      expiry: item.dg1.dateofexpiry ? format((parse(item.dg1.dateofexpiry, "ddMMyy", new Date())),"dd-MMM-yyyy") : "N/A",
      nationality: item.dg1.nationality || "Unknown",
      status: "Completed"/* ["Completed", "Failed"][Math.floor(Math.random() * 2)] */,
    }));

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
