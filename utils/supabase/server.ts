import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieRequest = Request | NextRequest;

function getCookieFromHeader(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) continue;

    const key = cookie.slice(0, separatorIndex).trim();
    const value = cookie.slice(separatorIndex + 1);

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export function createSupabaseServerClient(
  request: CookieRequest,
  response: NextResponse
) {
  const requestCookies = (request as NextRequest).cookies;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return (
            requestCookies?.get(name)?.value ??
            getCookieFromHeader(request.headers.get("cookie"), name)
          );
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}

export function createSupabaseRouteClient(request: Request) {
  const response = NextResponse.next();
  const supabase = createSupabaseServerClient(request, response);

  return { response, supabase };
}

export function withSupabaseCookies(
  response: NextResponse,
  cookieResponse: NextResponse
) {
  cookieResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

export function supabaseJson(
  body: unknown,
  init: ResponseInit | undefined,
  cookieResponse: NextResponse
) {
  return withSupabaseCookies(NextResponse.json(body, init), cookieResponse);
}
