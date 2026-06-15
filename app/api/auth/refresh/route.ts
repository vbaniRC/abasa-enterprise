import {
  createSupabaseRouteClient,
  supabaseJson,
} from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { response, supabase } = createSupabaseRouteClient(req);

  // Refresh session
  await supabase.auth.refreshSession();

  return supabaseJson({ success: true }, undefined, response);
}
