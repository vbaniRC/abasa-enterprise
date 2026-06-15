import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const { supabase, withCookies } = createRouteSupabaseClient(req);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return withCookies(
      NextResponse.json({ error: error.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      user: data.user,
    })
  );
}
