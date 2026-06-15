import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return withCookies(NextResponse.json({ valid: false }));
  }

  return withCookies(NextResponse.json({ valid: true, user: data.user }));
}
