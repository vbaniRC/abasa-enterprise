import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role, clubId } = body;

  // AUTH
  //await requireAuth(req as any, NextResponse);

  // ROLE → owner, admin, superadmin
 
  // Kreiraj usera u Supabase
  const user = (req as any).user;


  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Spremi u users tablicu
  await supabase.from("users").insert({
    auth_id: user.user?.id,
    email,
    role,
    club_id: clubId,
  });

  return NextResponse.json({
    message: "User created successfully",
    user: user.user,
  });
}
