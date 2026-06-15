import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const adminSupabase = createServiceRoleClient();
  const { data: targetProfile, error: targetProfileError } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (targetProfileError || !targetProfile) {
    return withCookies(
      NextResponse.json({ error: "User not found" }, { status: 404 })
    );
  }

  if (
    context.profile.role !== "superadmin" &&
    ["owner", "admin", "superadmin"].includes(targetProfile.role)
  ) {
    return withCookies(
      NextResponse.json({ error: "Forbidden" }, { status: 403 })
    );
  }

  const { error: profileDeleteError } = await adminSupabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileDeleteError) {
    return withCookies(
      NextResponse.json({ error: profileDeleteError.message }, { status: 400 })
    );
  }

  const { error: authDeleteError } =
    await adminSupabase.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    return withCookies(
      NextResponse.json({ error: authDeleteError.message }, { status: 400 })
    );
  }

  return withCookies(
    NextResponse.json({
      success: true,
      deletedUserId: userId,
    })
  );
}
