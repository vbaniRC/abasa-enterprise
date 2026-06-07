import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // TEMP: no auth
  const user = { club_id: null };

  const { data: members, error } = await supabase
    .from("users")
    .select("*")
    .eq("club_id", user.club_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Members fetched successfully",
    members,
  });
}
