// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/delete-logo/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → admin, owner, superadmin
  const roleResult = await requireRole(req as any, NextResponse, [
    "admin",
    "owner",
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;
  const body = await req.json();
  const { club_id } = body;

  if (!club_id) {
    return NextResponse.json(
      { success: false, error: "Missing club_id" },
      { status: 400 }
    );
  }

  // ADMIN/OWNER → mogu brisati samo svoj klub
  if (user.role !== "superadmin") {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("club_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    if (profile.club_id !== club_id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete logo for another club" },
        { status: 403 }
      );
    }
  }

  // DOHVATI TRENUTNI LOGO
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

  if (!club.logo_url) {
    return NextResponse.json(
      { success: false, error: "Club has no logo" },
      { status: 400 }
    );
  }

  // IZVADI PATH IZ URL-a
  const urlParts = club.logo_url.split("/club-logos/");
  const filePath = urlParts[1];

  // OBRIŠI IZ STORAGEA
  const { error: deleteError } = await supabase.storage
    .from("club-logos")
    .remove([filePath]);

  if (deleteError) {
    return NextResponse.json(
      { success: false, error: deleteError.message },
      { status: 500 }
    );
  }

  // RESETIRAJ logo_url
  const { error: updateError } = await supabase
    .from("clubs")
    .update({ logo_url: null })
    .eq("id", club_id);

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Logo deleted successfully",
    },
    { status: 200 }
  );
}
