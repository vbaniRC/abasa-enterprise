import { NextResponse } from "next/server";
import { ADMIN_ROLES, requireRole } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, full_name, avatar_url, role, club_id } = body;

  const auth = await requireRole(ADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // UPDATE PROFILE
  const { data, error } = await auth.adminSupabase!
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      role,
      club_id: club_id ?? null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    updatedUser: data,
  });
}
