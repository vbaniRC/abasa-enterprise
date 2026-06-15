import { requireProfileRole, requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { userIdSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { userId } = await parseJsonBody(request, userIdSchema);
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  await requireProfileRole(supabase, user.id, ["admin", "superadmin"]);

  const { error: profileDeleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  throwIfSupabaseError(profileDeleteError);

  const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);

  throwIfSupabaseError(authDeleteError);

  return successResponse({ deletedUserId: userId });
});
