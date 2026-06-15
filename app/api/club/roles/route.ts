import { NextResponse } from "next/server";
import { ADMIN_ROLES, requireRole } from "@/app/lib/auth";

export async function GET() {
  const auth = await requireRole(ADMIN_ROLES);

  if ("response" in auth) {
    return auth.response;
  }

  const roles = [
    "superadmin",
    "owner",
    "admin",
    "coach",
    "parent",
    "member",
  ];

  return NextResponse.json(
    {
      message: "Roles fetched successfully",
      roles,
    },
    { status: 200 }
  );
}
