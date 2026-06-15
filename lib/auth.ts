import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export type AppRole =
  | "superadmin"
  | "owner"
  | "admin"
  | "coach"
  | "parent"
  | "member";

type Profile = {
  id: string;
  role: AppRole | string | null;
  club_id?: string | null;
  full_name?: string | null;
};

export type AuthContext = {
  user: User;
  profile: Profile;
};

export async function getAuthContext(
  supabase: SupabaseClient
): Promise<AuthContext | NextResponse> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, club_id, full_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { user, profile };
}

export async function requireRoles(
  supabase: SupabaseClient,
  roles: AppRole[]
): Promise<AuthContext | NextResponse> {
  const context = await getAuthContext(supabase);

  if (context instanceof NextResponse) {
    return context;
  }

  if (!context.profile.role || !roles.includes(context.profile.role as AppRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return context;
}

export function isAuthResponse(
  context: AuthContext | NextResponse
): context is NextResponse {
  return context instanceof NextResponse;
}
