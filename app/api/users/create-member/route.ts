import { NextResponse } from "next/server";
import { STAFF_ROLES, requireRole } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, full_name, club_id, parent_id } = body;

  const auth = await requireRole(STAFF_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // KREIRAJ USERA
  const { data: newUser, error: createError } = await auth.adminSupabase!.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // KREIRAJ PROFIL
  const { error: profileInsertError } = await auth.adminSupabase!
    .from("profiles")
    .insert({
      id: newUser.user.id,
      full_name,
      role: "member",
      club_id,
      parent_id: parent_id ?? null,
    });

  if (profileInsertError) {
    return NextResponse.json({ error: profileInsertError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    user: newUser.user,
  });
}
