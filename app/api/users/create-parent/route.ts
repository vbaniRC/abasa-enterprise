import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, full_name, club_id } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, [
    "admin",
    "coach",
    "superadmin",
  ]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const adminSupabase = createServiceRoleClient();
  const { data: newUser, error: createError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    return withCookies(
      NextResponse.json({ error: createError.message }, { status: 400 })
    );
  }

  const { error: profileInsertError } = await adminSupabase
    .from("profiles")
    .insert({
      id: newUser.user.id,
      full_name,
      role: "parent",
      club_id,
    });

  if (profileInsertError) {
    return withCookies(
      NextResponse.json({ error: profileInsertError.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      user: newUser.user,
    })
  );
}
