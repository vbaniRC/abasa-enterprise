import { NextResponse } from "next/server";
import { ADMIN_ROLES, requireRole } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

  const auth = await requireRole(ADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // OBRIŠI PROFIL
  const { error: profileDeleteError } = await auth.adminSupabase!
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileDeleteError) {
    return NextResponse.json({ error: profileDeleteError.message }, { status: 400 });
  }

  // OBRIŠI USERA IZ AUTH
  const { error: authDeleteError } = await auth.adminSupabase!.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    return NextResponse.json({ error: authDeleteError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    deletedUserId: userId,
  });
}
