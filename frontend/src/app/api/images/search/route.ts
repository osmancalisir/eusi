// src/app/api/images/search/route.ts

export async function POST(request: Request) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    const body = await request.json();
    const res = await fetch(`${backendUrl}/api/images/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    return new Response(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
