import { NextResponse } from "next/server";

import {
  createSupabaseRouteClient,
  supabaseJson,
} from "@/utils/supabase/server";

export const ADMIN_ROLES = ["admin", "superadmin"] as const;
export const STAFF_ROLES = ["admin", "coach", "superadmin"] as const;

export async function requireUser(request: Request) {
  const { response, supabase } = createSupabaseRouteClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      errorResponse: supabaseJson(
        { error: "Unauthorized" },
        { status: 401 },
        response
      ),
    };
  }

  return { response, supabase, user };
}

export async function requireRoles(request: Request, allowedRoles: readonly string[]) {
  const auth = await requireUser(request);

  if ("errorResponse" in auth) {
    return auth;
  }

  const { data: profile, error } = await auth.supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (error || !profile || !allowedRoles.includes(profile.role)) {
    return {
      errorResponse: supabaseJson(
        { error: "Forbidden" },
        { status: 403 },
        auth.response
      ),
    };
  }

  return { ...auth, profile };
}

export function authJson(
  auth: { response: NextResponse },
  body: unknown,
  init?: ResponseInit
) {
  return supabaseJson(body, init, auth.response);
}
