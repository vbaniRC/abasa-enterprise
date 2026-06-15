import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const adminSupabase = createServiceRoleClient();
  await adminSupabase.storage.from("club-logos").remove([`${clubId}.png`]);

  const { error } = await adminSupabase
    .from("clubs")
    .delete()
    .eq("id", clubId);

  if (error) {
    return withCookies(
      NextResponse.json({ error: error.message }, { status: 400 })
    );
  }

  return withCookies(NextResponse.json({ success: true }));
}
