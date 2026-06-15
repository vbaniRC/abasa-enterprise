export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth";

export async function GET() {
  const auth = await requireUser();

  if ("response" in auth) {
    return NextResponse.json({ user: null });
  }

  // DOHVATI PROFIL
  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  return NextResponse.json({
    success: true,
    user: auth.user,
    profile,
  });
}
