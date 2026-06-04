// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/delete/route.ts)

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
  const { club_id } = body;

  if (!club_id) {
    return NextResponse.json(
      { success: false, error: "Missing club_id" },
      { status: 400 }
    );
  }

  // DOHVATI KLUB (da vidimo logo)
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("logo_url")
    .eq("id", club_id)
    .single();

  if (clubError || !club) {
    return NextResponse.json(
      { success: false, error: "Club not found" },
      { status: 404 }
    );
  }

  // 1) AKO POSTOJI LOGO → OBRIŠI GA
  if (club.logo_url) {
    const urlParts = club.logo_url.split("/club-logos/");
    const filePath = urlParts[1];

    await supabase.storage.from("club-logos").remove([filePath]);
  }

  // 2) OBRIŠI PROFILE KOJI PRIPADAJU KLUBU
  await supabase.from("profiles").delete().eq("club_id", club_id);

  // 3) OBRIŠI KLUB
  const { error: deleteError } = await supabase
    .from("clubs")
    .delete()
    .eq("id", club_id);

  if (deleteError) {
    return NextResponse.json(
      { success: false, error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Club deleted successfully",
    },
    { status: 200 }
  );
}
