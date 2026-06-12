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

  // AUTH → dohvati usera iz sessiona
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

  // DOHVATI KLUB
  const { data: club, error: clubError } = await supabase
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
