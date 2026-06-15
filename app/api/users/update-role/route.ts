import { requireProfileRole, requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { updateRoleSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { userId, role } = await parseJsonBody(request, updateRoleSchema);
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  await requireProfileRole(supabase, user.id, ["admin", "superadmin"]);

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  throwIfSupabaseError(error);

  return successResponse({ updatedUser: data });
});
