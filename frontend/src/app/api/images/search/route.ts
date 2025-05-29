// frontend/src/app/api/images/search/route.ts

export async function POST(request: Request) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const body = await request.json();

    console.log("Proxying GeoJSON search to backend:", JSON.stringify(body));

    const res = await fetch(`${backendUrl}/api/images/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error:", res.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Backend error",
          status: res.status,
          message: errorText,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
