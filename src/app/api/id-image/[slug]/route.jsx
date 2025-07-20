// Get API base URL from environment variable with fallback
const API_BASE_URL = process.env.API_BASE_URL || 'http://139.59.195.72:8080';

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
    const endpoint = `${API_BASE_URL}/idcards/${transactionId}`;

    try {
        const response = await fetch(endpoint, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        if (!data.file_data) {
            return new Response(JSON.stringify({ message: "No image data found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Return the base64 data directly to the client
        return new Response(JSON.stringify({ base64Image: data.file_data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Error fetching ID image" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
