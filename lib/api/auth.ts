import type { SupabaseClient, User } from "@supabase/supabase-js";

import { forbidden, unauthorized } from "@/lib/api/errors";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export async function requireUser(request: Request): Promise<User> {
  const { client } = createSupabaseSessionClient(request);
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    throw unauthorized();
  }

  return user;
}

export async function getCurrentUser(request: Request) {
  const { client, applyCookies } = createSupabaseSessionClient(request);
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  return {
    user: error ? null : user,
    applyCookies,
  };
}

export async function requireProfileRole(
  supabase: SupabaseClient,
  userId: string,
  allowedRoles: string[]
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !profile || !allowedRoles.includes(profile.role)) {
    throw forbidden();
  }

  return profile;
}
