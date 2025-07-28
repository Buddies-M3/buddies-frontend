// Get API base URL from environment variable with fallback
const API_BASE_URL = process.env.API_BASE_URL || 'http://139.59.195.72:8080';

export async function DELETE(req, { params }) {
  if (!params || !params.id) {
    return new Response(
      JSON.stringify({ message: "Missing transaction ID in params" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const transactionId = params.id;
  const endpoint = `${API_BASE_URL}/transactions/${transactionId}`;

  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete transaction: ${response.statusText}`);
    }

    return new Response(
      JSON.stringify({ message: "Transaction deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}