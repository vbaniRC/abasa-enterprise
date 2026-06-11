import { NextResponse } from "next/server";
export const runtime = "nodejs";

function requireAuth() {
  return true;
}

function requireRole() {
  return true;
}

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Missing email or password" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}
