import { NextResponse } from "next/server";
import { ADMIN_ROLES, requireRole } from "@/app/lib/auth";

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

  const auth = await requireRole(ADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  // UPLOAD TO STORAGE
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await auth.adminSupabase!.storage
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
  const { error: dbError } = await auth.adminSupabase!
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
