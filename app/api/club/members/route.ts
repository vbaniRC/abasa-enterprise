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

  // DOHVATI SVE ČLANOVE KLUBA
  const { data: members, error: membersError } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  if (membersError) {
    return NextResponse.json(
      { error: membersError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    members,
  });
}
