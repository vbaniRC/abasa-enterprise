import { NextResponse } from "next/server";
import { isAuthResponse, requireRoles } from "@/lib/auth";
import { createRouteSupabaseClient } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { supabase, withCookies } = createRouteSupabaseClient(req);
  const context = await requireRoles(supabase, ["admin", "superadmin"]);

  if (isAuthResponse(context)) {
    return withCookies(context);
  }

  const roles = [
    "superadmin",
    "owner",
    "admin",
    "coach",
    "parent",
    "member",
  ];

  return withCookies(
    NextResponse.json(
      {
        message: "Roles fetched successfully",
        roles,
      },
      { status: 200 }
    )
  );
}
