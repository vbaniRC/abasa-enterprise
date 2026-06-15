export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return withCookies(NextResponse.json({ user: null }));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return withCookies(
    NextResponse.json({
      success: true,
      user,
      profile,
    })
  );
}
