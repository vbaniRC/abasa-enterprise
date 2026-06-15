import { NextResponse } from "next/server";
import { getAuthContext, isAuthResponse } from "@/lib/auth";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { full_name, avatar_url, additional_data } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await getAuthContext(supabase);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      additional_data,
    })
    .eq("id", context.user.id)
    .select()
    .single();

  if (error) {
    return withCookies(
      NextResponse.json({ error: error.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      profile: data,
    })
  );
}
