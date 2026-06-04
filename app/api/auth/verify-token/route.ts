// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/auth/verify-token/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { access_token } = body;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Missing access_token" },
      { status: 400 }
    );
  }

  // 1) VALIDIRAJ TOKEN
  const { data: userData, error: tokenError } = await supabase.auth.getUser(
    access_token
  );

  if (tokenError || !userData?.user) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const user = userData.user;

  // 2) DOHVATI PROFIL
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role, is_owner, club_id, name, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { success: false, error: "Profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      valid: true,
      user: profile,
    },
    { status: 200 }
  );
}
