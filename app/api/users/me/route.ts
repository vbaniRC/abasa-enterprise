import { NextResponse } from "next/server";
import { getAuthContext, isAuthResponse } from "@/lib/auth";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await getAuthContext(supabase);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  return withCookies(
    NextResponse.json({
      success: true,
      user: context.user,
      profile: context.profile,
    })
  );
}
