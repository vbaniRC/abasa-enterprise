import { requireProfileRole, requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { adminCreateSchema } from "@/lib/api/schemas";
import { parseJsonBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const { email, password, full_name } = await parseJsonBody(
    request,
    adminCreateSchema
  );
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  await requireProfileRole(supabase, user.id, ["superadmin"]);

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
    role: "admin",
  });

  throwIfSupabaseError(profileInsertError);

  return successResponse({ user: newUser.user });
});
