import { NextResponse } from "next/server";

import {
  createSupabaseRouteClient,
  supabaseJson,
} from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const { response, supabase } = createSupabaseRouteClient(req);

  // LOGIN
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return supabaseJson({ error: error.message }, { status: 400 }, response);
  }

  return supabaseJson({ success: true, user: data.user }, undefined, response);
}
