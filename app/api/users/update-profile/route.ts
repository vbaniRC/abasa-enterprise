import { requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { updateProfileSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { full_name, avatar_url, additional_data } = await parseJsonBody(
    request,
    updateProfileSchema
  );
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      additional_data,
    })
    .eq("id", user.id)
    .select()
    .single();

  throwIfSupabaseError(error);

  return successResponse({ profile: data });
});
