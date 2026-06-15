import { NextResponse } from "next/server";
import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

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

  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // UPLOAD TO STORAGE
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await auth.supabase.storage
    .from("club-logos")
    .upload(`${clubId}.png`, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return authJson(auth, { error: uploadError.message }, { status: 400 });
  }

  // UPDATE DB
  const { error: dbError } = await auth.supabase
    .from("clubs")
    .update({
      logo_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`,
    })
    .eq("id", clubId);

  if (dbError) {
    return authJson(auth, { error: dbError.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    logoUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`,
  });
}
