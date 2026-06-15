export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAuthContext, isAuthResponse } from "@/lib/auth";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await getAuthContext(supabase);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("*")
    .eq("club_id", context.profile.club_id)
    .order("created_at", { ascending: false });

  if (membersError) {
    return withCookies(
      NextResponse.json({ error: membersError.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      members,
    })
  );
}
