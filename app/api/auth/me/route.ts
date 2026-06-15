export const dynamic = "force-dynamic";
import { getCurrentUser } from "@/lib/api/auth";
import { unauthorized, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const GET = withApiHandler(async (request) => {
  const { user, applyCookies } = await getCurrentUser(request);

  if (!user) {
    throw unauthorized();
  }

  const supabase = createSupabaseAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return applyCookies(successResponse({ user, profile: profile ?? null }));
});
