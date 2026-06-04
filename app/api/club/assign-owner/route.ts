// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/assign-owner/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → samo superadmin
  const roleResult = await requireRole(req as any, NextResponse, ["superadmin"]);
  if (roleResult instanceof NextResponse) return roleResult;

  const body = await req.json();
  const { user_id, club_id } = body;

  if (!user_id || !club_id) {
    return NextResponse.json(
      { success: false, error: "Missing user_id or club_id" },
      { status: 400 }
    );
  }

  // 1) Provjeri da user postoji i pripada klubu
  const { data: targetProfile, error: targetError } = await supabase
    .from("profiles")
    .select("id, role, club_id")
    .eq("id", user_id)
    .single();

  if (targetError || !targetProfile) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  if (targetProfile.club_id !== club_id) {
    return NextResponse.json(
      { success: false, error: "User does not belong to this club" },
      { status: 403 }
    );
  }

  // 2) Makni owner status od trenutnog ownera (ako postoji)
  await supabase
    .from("profiles")
    .update({ is_owner: false, role: "admin" })
    .eq("club_id", club_id)
    .eq("is_owner", true);

  // 3) Postavi novog ownera
  const { data, error } = await supabase
    .from("profiles")
    .update({
      role: "owner",
      is_owner: true,
    })
    .eq("id", user_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Owner assigned successfully",
      data,
    },
    { status: 200 }
  );
}
