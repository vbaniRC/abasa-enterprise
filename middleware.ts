import { NextResponse } from "next/server";

export async function middleware() {
  const res = NextResponse.next();

  return res;
}

// ⭐ MATCHER — OVO JE KLJUČ
// NE uključuje /auth/verify
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/club/:path*",
    "/settings/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/confirm",
    "/auth/callback"
  ],
};
