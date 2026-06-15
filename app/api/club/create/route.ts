import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description } = body;

  const auth = await requireUser();

  if ("response" in auth) {
    return auth.response;
  }

  // CREATE CLUB
  const { data, error } = await auth.supabase
    .from("clubs")
    .insert({
      name,
      description,
      owner_id: auth.user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, club: data });
}
