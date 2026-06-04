// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/list/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function GET(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → owner, admin, superadmin
  const roleResult = await requireRole(req as any, NextResponse, [
    "owner",
    "admin",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const requester: any = (req as any).user;

  // SUPERADMIN → vidi sve korisnike
  if (requester.role === "superadmin") {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role, club_id, is_owner, created_at");

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  }

  // OWNER/ADMIN → vide samo korisnike svog kluba
  const { data: requesterProfile, error: requesterError } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", requester.id)
    .single();

  if (requesterError || !requesterProfile) {
    return NextResponse.json(
      { success: false, error: "Requester profile not found" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, role, club_id, is_owner, created_at")
    .eq("club_id", requesterProfile.club_id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}
