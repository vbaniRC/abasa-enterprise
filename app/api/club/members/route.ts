export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const res = NextResponse.json({ success: false });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.headers
            .get("cookie")
            ?.match(new RegExp(`${name}=([^;]+)`))?.[1] ?? null;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name) {
          res.cookies.delete(name);
        },
      },
    }
  );

  // AUTH → dohvati usera
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // DOHVATI PROFIL
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  // DOHVATI SVE ČLANOVE KLUBA
  const { data: members, error: membersError } = await supabase
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
