import {
  createSupabaseRouteClient,
  supabaseJson,
} from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { response, supabase } = createSupabaseRouteClient(req);

  await supabase.auth.signOut();

  return supabaseJson({ success: true }, undefined, response);
}
