// frontend/src/app/api/orders/route.ts

const getBackendUrl = () => process.env.BACKEND_URL || "http://localhost:4000";

const handleBackendResponse = async (res: Response) => {
  const responseText = await res.text();
  const contentType = res.headers.get("Content-Type") || "text/plain";

  if (!res.ok) {
    console.error(`Backend error: ${res.status} - ${responseText}`);
  }

  return new Response(responseText, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
};

const handleProxyError = (error: any) => {
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
};

export async function GET() {
  try {
    const res = await fetch(`${getBackendUrl()}/api/orders`);
    return await handleBackendResponse(res);
  } catch (error: any) {
    return handleProxyError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${getBackendUrl()}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleBackendResponse(res);
  } catch (error: any) {
    return handleProxyError(error);
  }
}
