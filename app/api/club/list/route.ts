
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ADMIN_ROLES, requireRole } from "@/app/lib/auth";

export async function GET() {
  const auth = await requireRole(ADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // DOHVATI SVE KLUBOVE
  const { data: clubs, error } = await auth.adminSupabase!
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    clubs,
  });
}
