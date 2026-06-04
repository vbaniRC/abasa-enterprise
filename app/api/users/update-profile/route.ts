// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/users/update-profile/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  const user: any = (req as any).user;
  const body = await req.json();

  const { user_id, email, name, avatar_url } = body;

  // Ako user_id nije poslan → user ažurira SAM SEBE
  const targetUserId = user_id || user.id;

  // Ako user želi ažurirati nekog drugog → mora biti admin ili superadmin
  if (targetUserId !== user.id) {
    const roleCheck = await requireRole(req as any, NextResponse, [
      "admin",
      "superadmin",
    ]);
    if (roleCheck instanceof NextResponse) return roleCheck;
  }

  // UPDATE PROFILA
  const updateData: any = {};

  if (email) updateData.email = email;
  if (name) updateData.name = name;
  if (avatar_url) updateData.avatar_url = avatar_url;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { success: false, error: "No fields provided for update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", targetUserId)
    .select()
    .single();

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
