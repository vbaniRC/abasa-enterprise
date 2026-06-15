import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import type { AppRole } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

const elevatedRoles: AppRole[] = ["owner", "admin"];
const managedRoles: AppRole[] = ["coach", "parent", "member"];

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, full_name, avatar_url, role, club_id } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const allowedRoles =
    context.profile.role === "superadmin"
      ? [...elevatedRoles, ...managedRoles]
      : managedRoles;

  if (role && !allowedRoles.includes(role)) {
    return withCookies(
      NextResponse.json({ error: "Forbidden" }, { status: 403 })
    );
  }

  const adminSupabase = createServiceRoleClient();
  const { data, error } = await adminSupabase
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      role,
      club_id: club_id ?? null,
    })
    .eq("id", userId)
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
      updatedUser: data,
    })
  );
}
