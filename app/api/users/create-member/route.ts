import { requireProfileRole, requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { memberCreateSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { email, password, full_name, club_id, parent_id } =
    await parseJsonBody(request, memberCreateSchema);
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  await requireProfileRole(supabase, user.id, [
    "admin",
    "coach",
    "superadmin",
  ]);

  const { data: newUser, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  throwIfSupabaseError(createError);

  const { error: profileInsertError } = await supabase.from("profiles").insert({
    id: newUser.user.id,
    full_name,
    role: "member",
    club_id,
    parent_id: parent_id ?? null,
  });

  throwIfSupabaseError(profileInsertError);

  return successResponse({ user: newUser.user });
});
