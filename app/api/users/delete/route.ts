import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

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

  // AUTH → samo admin/superadmin smiju brisati usera
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

  // OBRIŠI PROFIL
  const { error: profileDeleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileDeleteError) {
    return NextResponse.json({ error: profileDeleteError.message }, { status: 400 });
  }

  // OBRIŠI USERA IZ AUTH
  const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    return NextResponse.json({ error: authDeleteError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    deletedUserId: userId,
  });
}
