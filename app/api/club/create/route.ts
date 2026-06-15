import { requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { clubCreateSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { name, description } = await parseJsonBody(request, clubCreateSchema);
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("clubs")
    .insert({
      name,
      description,
      owner_id: user.id,
    })
    .select()
    .single();

  throwIfSupabaseError(error);

  return successResponse({ club: data });
});
