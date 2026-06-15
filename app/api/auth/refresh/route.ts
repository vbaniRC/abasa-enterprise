import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = createClient();

  // Refresh session
  await supabase.auth.refreshSession();

  return NextResponse.json({ success: true });
}
