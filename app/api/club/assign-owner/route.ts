import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId, userId } = body;

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

  // AUTH CHECK
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ROLE CHECK (ako imaš role sistem)
  // const { data: role } = await supabase.from("roles").select("*").eq("id", user.id).single();
  // if (role.name !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // UPDATE OWNER
  const { error } = await supabase
    .from("clubs")
    .update({ owner_id: userId })
    .eq("id", clubId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
