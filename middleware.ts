import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase SSR client (cookies adapter)
  const supabase = createSupabaseServerClient(req, res);

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
