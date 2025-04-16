export async function checkHealth() {
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  