import { NextResponse } from "next/server";
import { SUPERADMIN_ROLES, requireRole } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId, userId } = body;

  const auth = await requireRole(SUPERADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // UPDATE OWNER
  const { error } = await auth.adminSupabase!
    .from("clubs")
    .update({ owner_id: userId })
    .eq("id", clubId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
