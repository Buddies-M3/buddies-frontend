export async function GET() {
    const transactions = [
      { id: 1, transactions: 120, date: "2024-12-18" },
      { id: 2, transactions: 50, date: "2024-12-17" },
      { id: 3, transactions: 300, date: "2024-12-16" },
      { id: 4, transactions: 200, date: "2024-12-11" },
      { id: 5, transactions: 450, date: "2024-11-30" },
    ];
  
    return new Response(JSON.stringify(transactions), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  