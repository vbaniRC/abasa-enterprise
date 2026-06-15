import { withApiHandler, throwIfSupabaseError } from "@/lib/api/errors";
import { loginSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { successResponse } from "@/lib/api/response";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const POST = withApiHandler(async (request) => {
  const { email, password } = await parseJsonBody(request, loginSchema);
  const { client, applyCookies } = createSupabaseSessionClient(request);

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  throwIfSupabaseError(error);

  return applyCookies(successResponse({ user: data.user }));
});
