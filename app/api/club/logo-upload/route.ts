import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const clubId = formData.get("clubId") as string;

  if (!file || !clubId) {
    return NextResponse.json(
      { error: "Missing file or clubId" },
      { status: 400 }
    );
  }

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

  // UPLOAD TO STORAGE
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("club-logos")
    .upload(`${clubId}.png`, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 400 }
    );
  }

  // UPDATE DB
  const { error: dbError } = await supabase
    .from("clubs")
    .update({
      logo_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`,
    })
    .eq("id", clubId);

  if (dbError) {
    return NextResponse.json(
      { error: dbError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    logoUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`,
  });
}
