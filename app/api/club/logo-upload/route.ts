import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

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

  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const adminSupabase = createServiceRoleClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminSupabase.storage
    .from("club-logos")
    .upload(`${clubId}.png`, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return withCookies(
      NextResponse.json({ error: uploadError.message }, { status: 400 })
    );
  }

  const { error: dbError } = await adminSupabase
    .from("clubs")
    .update({
      logo_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`,
    })
    .eq("id", clubId);

  if (dbError) {
    return withCookies(
      NextResponse.json({ error: dbError.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      logoUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`,
    })
  );
}
