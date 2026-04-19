import { NextRequest, NextResponse } from "next/server";

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function requireApiKey(req: NextRequest): NextResponse | null {
  const expected = process.env.API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "API_KEY not configured on server" },
      { status: 503 },
    );
  }
  const header = req.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : null;
  const xKey = req.headers.get("x-api-key") ?? null;
  const provided = bearer ?? xKey;
  if (!provided || provided !== expected) return unauthorized();
  return null;
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}
