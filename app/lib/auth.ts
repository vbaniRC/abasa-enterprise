import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const ADMIN_ROLES = ["admin", "superadmin"] as const;
export const STAFF_ROLES = ["admin", "coach", "superadmin"] as const;
export const SUPERADMIN_ROLES = ["superadmin"] as const;

type AuthContext = {
  supabase: ReturnType<typeof createClient>;
  adminSupabase?: ReturnType<typeof createAdminClient>;
  user: User;
  profile?: {
    role?: string | null;
    club_id?: string | null;
  };
};

type AuthResult = AuthContext | { response: NextResponse };

export async function requireUser(): Promise<AuthResult> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    supabase,
    user,
  };
}

export async function requireRole(
  allowedRoles: readonly string[]
): Promise<AuthResult> {
  const auth = await requireUser();

  if ("response" in auth) {
    return auth;
  }

  const adminSupabase = createAdminClient();
  const { data: profile, error } = await adminSupabase
    .from("profiles")
    .select("role, club_id")
    .eq("id", auth.user.id)
    .single();

  if (error || !profile || !allowedRoles.includes(profile.role)) {
    return {
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ...auth,
    adminSupabase,
    profile,
  };
}
