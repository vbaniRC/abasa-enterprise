import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { full_name, avatar_url, additional_data } = body;

  const auth = await requireUser();

  if ("response" in auth) {
    return auth.response;
  }

  // UPDATE PROFILE
  const { data, error } = await auth.supabase
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      additional_data,
    })
    .eq("id", auth.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    profile: data,
  });
}
