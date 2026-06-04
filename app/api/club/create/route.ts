// (GITHUB-PUTANJA-FILE: /abasa-sport/app/api/club/create/route.ts)

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/role";

export async function POST(req: Request) {
  // AUTH
  const authResult = await requireAuth(req as any, NextResponse);
  if (authResult instanceof NextResponse) return authResult;

  // ROLE → samo superadmin
  const roleResult = await requireRole(req as any, NextResponse, ["superadmin"]);
  if (roleResult instanceof NextResponse) return roleResult;

  const body = await req.json();
  const { name, sport, currency } = body;

  if (!name || !sport || !currency) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 1) KREIRAJ KLUB
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .insert({
      name,
      sport,
      currency,
    })
    .select()
    .single();

  if (clubError) {
    return NextResponse.json(
      { success: false, error: clubError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: club,
    },
    { status: 200 }
  );
}
