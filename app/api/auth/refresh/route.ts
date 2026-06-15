import { withApiHandler, throwIfSupabaseError } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const POST = withApiHandler(async (request) => {
  const { client, applyCookies } = createSupabaseSessionClient(request);
  const { error } = await client.auth.refreshSession();

  throwIfSupabaseError(error);

  return applyCookies(successResponse({ refreshed: true }));
});
