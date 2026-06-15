import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

type CookieOptions = any;
type PendingCookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
}

function parseCookieHeader(cookieHeader: string | null) {
  const cookies = new Map<string, string>();

  cookieHeader?.split(";").forEach((cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (!name) return;

    const value = valueParts.join("=");

    try {
      cookies.set(name, decodeURIComponent(value));
    } catch {
      cookies.set(name, value);
    }
  });

  return cookies;
}

export function createRouteSupabaseClient(req: Request) {
  const requestCookies = parseCookieHeader(req.headers.get("cookie"));
  const pendingCookies: PendingCookie[] = [];

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(name) {
        return requestCookies.get(name);
      },
      set(name, value, options) {
        requestCookies.set(name, value);
        pendingCookies.push({ name, value, options });
      },
      remove(name, options) {
        requestCookies.delete(name);
        pendingCookies.push({
          name,
          value: "",
          options: { ...options, maxAge: 0 },
        });
      },
    },
  });

  return {
    supabase,
    withCookies(response: NextResponse) {
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });

      return response;
    },
  };
}

export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
