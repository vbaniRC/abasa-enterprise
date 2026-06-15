import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const cookieUpdates: Array<{
    name: string;
    value: string;
    options?: any;
  }> = [];
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          cookieUpdates.push({ name, value, options });
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          cookieUpdates.push({
            name,
            value: "",
            options: { ...options, maxAge: 0 },
          });
          res.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (req.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set(
      "redirectedFrom",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );

    res = NextResponse.redirect(redirectUrl);
  }

  if (
    (req.nextUrl.pathname === "/auth/login" ||
      req.nextUrl.pathname === "/auth/register") &&
    user
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    res = NextResponse.redirect(redirectUrl);
  }

  cookieUpdates.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options);
  });

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register"
  ],
};
