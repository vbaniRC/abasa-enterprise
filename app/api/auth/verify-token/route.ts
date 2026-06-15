import {
  createSupabaseRouteClient,
  supabaseJson,
} from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { response, supabase } = createSupabaseRouteClient(req);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return supabaseJson({ valid: false }, undefined, response);
  }

  return supabaseJson({ valid: true, user: data.user }, undefined, response);
}
