import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  // TEMP: nema auth-a dok ne vratiš middleware
  const user = { club_id: null };

  // Ako želiš da ruta radi bez auth-a:
  return NextResponse.json(
    {
      message: "Auth middleware removed — implement later",
      club: null,
    },
    { status: 200 }
  );
}
