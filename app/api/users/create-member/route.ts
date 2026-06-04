// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/create-member/route.ts)

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
    "superadmin",
  ]);
  if (roleResult instanceof NextResponse) return roleResult;

  const user: any = (req as any).user;
  const body = await req.json();

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // DOHVATI CLUB ID ADMINA KOJI KREIRA MEMBERA
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile?.club_id) {
    return NextResponse.json(
      { success: false, error: "Admin has no club assigned" },
      { status: 404 }
    );
  }

  const clubId = profile.club_id;

  // 1) Kreiraj usera u Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authUser?.user) {
    return NextResponse.json(
      { success: false, error: authError?.message || "Failed to create user" },
      { status: 500 }
    );
  }

  const newUserId = authUser.user.id;

  // 2) Kreiraj profil
  const { error: profileInsertError } = await supabase.from("profiles").insert({
    id: newUserId,
    email,
    role: "member",
    is_owner: false,
    club_id: clubId,
  });

  if (profileInsertError) {
    return NextResponse.json(
      { success: false, error: profileInsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        id: newUserId,
        email,
        role: "member",
        club_id: clubId,
      },
    },
    { status: 200 }
  );
}
