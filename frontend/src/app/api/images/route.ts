// frontend/src/app/api/images/route.ts

export async function POST(request: Request) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const body = await request.json();
    const res = await fetch(`${backendUrl}/api/images/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return new Response(await res.text(), { status: res.status });
  } catch (error) {
    return new Response(JSON.stringify({ error: `Internal server error: ${error}` }), { status: 500 });
  }
}
