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
  const { email, password, full_name, role, club_id } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const allowedRoles =
    context.profile.role === "superadmin"
      ? [...elevatedRoles, ...managedRoles]
      : managedRoles;

  if (!allowedRoles.includes(role)) {
    return withCookies(
      NextResponse.json({ error: "Forbidden" }, { status: 403 })
    );
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
      role,
      club_id: club_id ?? null,
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
