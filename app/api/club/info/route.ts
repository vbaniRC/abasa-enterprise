export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth";

export async function GET() {
  const auth = await requireUser();

  if ("response" in auth) {
    return auth.response;
  }

  // DOHVATI PROFIL
  const { data: profile, error: profileError } = await auth.supabase
    .from("profiles")
    .select("club_id")
    .eq("id", auth.user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  // DOHVATI KLUB
  const { data: club, error: clubError } = await auth.supabase
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  if (clubError || !club) {
    return NextResponse.json(
      { error: "Club not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    club,
  });
}
