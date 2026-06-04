// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/create-admin/route.ts)

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
  const { email, password, club_id } = body;

  if (!email || !password || !club_id) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

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

  const userId = authUser.user.id;

  // 2) Kreiraj profil
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email,
    role: "admin",
    is_owner: false,
    club_id,
  });

  if (profileError) {
    return NextResponse.json(
      { success: false, error: profileError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data: { id: userId, email, role: "admin", club_id } },
    { status: 200 }
  );
}
