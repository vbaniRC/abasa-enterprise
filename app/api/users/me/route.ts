import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // TEMP: nema auth-a dok ne vratiš middleware
  const user = { auth_id: null };

  // Ako želiš da ruta radi bez auth-a:
  // možeš odmah vratiti praznog usera ili error
  return NextResponse.json(
    {
      message: "Auth middleware removed — implement later",
      user: null,
    },
    { status: 200 }
  );
}
