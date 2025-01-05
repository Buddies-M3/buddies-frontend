import { parse, format } from "date-fns";

export async function GET() {
  const endpoint = "http://188.166.205.153:8080/transactions";

  try {
    const response = await fetch(endpoint);
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
      expiry: format((parse(item.dg1.dateofexpiry, "yyMMdd", new Date())),"dd-MMM-yyyy"),
      nationality: item.dg1.nationality || "Unknown",
      status: ["Completed", "Failed", "Pending"][Math.floor(Math.random() * 3)],
    }));

    return new Response(JSON.stringify(transactions), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
