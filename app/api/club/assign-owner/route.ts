import { requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { clubOwnerSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { clubId, userId } = await parseJsonBody(request, clubOwnerSchema);
  await requireUser(request);

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("clubs")
    .update({ owner_id: userId })
    .eq("id", clubId);

  throwIfSupabaseError(error);

  return successResponse();
});
