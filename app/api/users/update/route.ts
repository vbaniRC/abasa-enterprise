import { requireProfileRole, requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { updateUserSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { userId, full_name, avatar_url, role, club_id } = await parseJsonBody(
    request,
    updateUserSchema
  );
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  await requireProfileRole(supabase, user.id, ["admin", "superadmin"]);

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      role,
      club_id: club_id ?? null,
    })
    .eq("id", userId)
    .select()
    .single();

  throwIfSupabaseError(error);

  return successResponse({ updatedUser: data });
});
