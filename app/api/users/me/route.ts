import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth";

export async function GET() {
  const auth = await requireUser();

  if ("response" in auth) {
    return auth.response;
  }

  const { data: profile, error } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    user: auth.user,
    profile,
  });
}
