import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);

  await supabase.auth.refreshSession();

  return withCookies(NextResponse.json({ success: true }));
}
