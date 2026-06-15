import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function createMembersAuthClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server components cannot mutate cookies; server actions can.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch {
            // Server components cannot mutate cookies; server actions can.
          }
        },
      },
    }
  );
}

export function createMembersAdminClient() {
  return createClient<Database>(
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

export async function requireMembersUser(): Promise<User> {
  const supabase = createMembersAuthClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return user;
}

export async function requireUserClubId() {
  const user = await requireMembersUser();
  const supabase = createMembersAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    user,
    supabase,
    clubId: profile?.club_id ?? null,
  };
}
