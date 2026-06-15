import { requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { clubIdSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { clubId } = await parseJsonBody(request, clubIdSchema);
  await requireUser(request);

  const supabase = createSupabaseAdminClient();

  await supabase.storage.from("club-logos").remove([`${clubId}.png`]);

  const { error } = await supabase.from("clubs").delete().eq("id", clubId);

  throwIfSupabaseError(error);

  return successResponse();
});
