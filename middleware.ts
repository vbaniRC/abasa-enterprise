import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase SSR client (cookies adapter)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, "", options);
        },
      },
    }
  );

  // Ako želiš auth check, možeš ovdje:
  // const { data: { user } } = await supabase.auth.getUser();

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
