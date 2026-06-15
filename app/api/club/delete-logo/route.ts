import { NextResponse } from "next/server";
import { ADMIN_ROLES, requireRole } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId } = body;

  const auth = await requireRole(ADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // DELETE CLUB LOGO FROM STORAGE (optional)
  await auth.adminSupabase!.storage.from("club-logos").remove([`${clubId}.png`]);

  // DELETE CLUB FROM DB
  const { error } = await auth.adminSupabase!
    .from("clubs")
    .delete()
    .eq("id", clubId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
