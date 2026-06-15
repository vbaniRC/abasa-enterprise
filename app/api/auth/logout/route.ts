import { withApiHandler, throwIfSupabaseError } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { client, applyCookies } = createSupabaseSessionClient(request);
  const { error } = await client.auth.signOut();

  throwIfSupabaseError(error);

  return applyCookies(successResponse());
});
