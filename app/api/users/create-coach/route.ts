import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, full_name, club_id } = body;

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

  // AUTH → samo admin/superadmin smije kreirati coacha
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // PROVJERI ROLE
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !["admin", "superadmin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // KREIRAJ USERA
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // KREIRAJ PROFIL
  const { error: profileInsertError } = await supabase
    .from("profiles")
    .insert({
      id: newUser.user.id,
      full_name,
      role: "coach",
      club_id,
    });

  if (profileInsertError) {
    return NextResponse.json({ error: profileInsertError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    user: newUser.user,
  });
}
