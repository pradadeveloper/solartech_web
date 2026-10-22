// Endpoint heredado de WordPress, eliminado de forma permanente.
export function GET() {
  return new Response("Gone", { status: 410 });
}

export const POST = GET;
