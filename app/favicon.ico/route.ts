import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/images/Logo.jpeg?v=4", request.url), 307);
}
