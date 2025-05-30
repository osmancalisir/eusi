// frontend/src/app/api/images/search/route.ts

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";

  try {
    const body = await request.json();
    console.log("Proxying GeoJSON search to backend:", JSON.stringify(body));

    const res = await fetch(`${backendUrl}/api/images/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    const contentType = res.headers.get("Content-Type") || "text/plain";

    if (!res.ok) {
      console.error(`Backend error: ${res.status} - ${responseText}`);
    }

    return new Response(responseText, {
      status: res.status,
      headers: { "Content-Type": contentType },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
