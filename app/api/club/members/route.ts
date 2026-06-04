// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/members/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function GET(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → admin, owner, coach, parent, member, superadmin
  const roleResult = await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "coach",
    "parent",
    "member",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;

  const url = new URL(req.url);
  const filterRole = url.searchParams.get("role"); // optional filter
  const overrideClubId = url.searchParams.get("club_id");

  let clubId: string | null = null;

  // SUPERADMIN može specificirati club_id
  if (user.role === "superadmin" && overrideClubId) {
    clubId = overrideClubId;
  } else {
    // DOHVATI CLUB ID USERA
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.club_id) {
      return NextResponse.json(
        { success: false, error: "User has no club assigned" },
        { status: 404 }
      );
    }

    clubId = profile.club_id;
  }

  // QUERY BUILDER
  let query = supabase
    .from("profiles")
    .select("id, email, role, name, avatar_url, is_owner")
    .eq("club_id", clubId)
    .order("role", { ascending: true });

  // FILTER PO ROLI (ako je poslano)
  if (filterRole) {
    query = query.eq("role", filterRole);
  }

  const { data: members, error } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: members,
    },
    { status: 200 }
  );
}
