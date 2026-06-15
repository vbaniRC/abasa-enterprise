import { requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { clubUpdateSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { clubId, name, description } = await parseJsonBody(
    request,
    clubUpdateSchema
  );
  await requireUser(request);

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("clubs")
    .update({
      name,
      description,
    })
    .eq("id", clubId)
    .select()
    .single();

  throwIfSupabaseError(error);

  return successResponse({ club: data });
});
