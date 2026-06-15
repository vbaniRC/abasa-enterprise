
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return withCookies(
      NextResponse.json({ error: error.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      clubs,
    })
  );
}
