import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

type CookieMutation = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? cookie.slice(name.length + 1) : null;
}

export function createSupabaseAdminClient() {
  return createClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export function createSupabaseSessionClient(request: Request) {
  const mutations: CookieMutation[] = [];

  const client = createServerClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        get(name) {
          return getCookieValue(request, name);
        },
        set(name, value, options) {
          mutations.push({ name, value, options });
        },
        remove(name, options) {
          mutations.push({
            name,
            value: "",
            options: { ...options, maxAge: 0 },
          });
        },
      },
    }
  );

  return {
    client,
    applyCookies(response: NextResponse) {
      mutations.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as never);
      });

      return response;
    },
  };
}
