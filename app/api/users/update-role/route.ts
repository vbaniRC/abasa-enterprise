import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import type { AppRole } from "@/lib/auth";
import {
  createRouteSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

const allowedTargetRoles: AppRole[] = [
  "owner",
  "admin",
  "coach",
  "parent",
  "member",
];

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, role } = body;
  const { supabase, withCookies } = createRouteSupabaseClient(req);

  const context = await requireRoles(supabase, ["superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  if (!allowedTargetRoles.includes(role)) {
    return withCookies(
      NextResponse.json({ error: "Invalid role" }, { status: 400 })
    );
  }

  const adminSupabase = createServiceRoleClient();
  const { data, error } = await adminSupabase
    .from("profiles")
    .update({ role })
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
