import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const adminSupabase = createServiceRoleClient();
  const { data, error } = await adminSupabase
    .from("clubs")
    .insert({
      name,
      description,
      owner_id: context.user.id,
    })
    .select()
    .single();

  if (error) {
    return withCookies(
      NextResponse.json({ error: error.message }, { status: 400 })
    );
  }

  return withCookies(NextResponse.json({ success: true, club: data }));
}
