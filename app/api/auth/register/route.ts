import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { registerSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const POST = withApiHandler(async (request) => {
  const { email } = await parseJsonBody(request, registerSchema);
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`,
    },
  });

  throwIfSupabaseError(error);

  return successResponse({ ok: true });
});
