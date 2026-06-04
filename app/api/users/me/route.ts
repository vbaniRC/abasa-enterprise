// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/me/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";

export async function GET(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  const user: any = (req as any).user;

  // DOHVATI PROFIL
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, role, is_owner, club_id, name, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { success: false, error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: profile,
    },
    { status: 200 }
  );
}
