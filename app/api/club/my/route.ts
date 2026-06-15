import { NextResponse } from "next/server";
import { getAuthContext, isAuthResponse } from "@/lib/auth";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await getAuthContext(supabase);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  if (!context.profile.club_id) {
    return withCookies(
      NextResponse.json({ error: "Club not found" }, { status: 404 })
    );
  }

  const { data: club, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", context.profile.club_id)
    .single();

  if (error || !club) {
    return withCookies(
      NextResponse.json({ error: "Club not found" }, { status: 404 })
    );
  }

  return withCookies(NextResponse.json({ success: true, club }));
}
