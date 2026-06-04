// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/roles/route.ts)

import { NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";

export async function GET(req: Request) {
  // AUTH → bilo koji logirani user može vidjeti role
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

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
      success: true,
      data: roles,
    },
    { status: 200 }
  );
}
