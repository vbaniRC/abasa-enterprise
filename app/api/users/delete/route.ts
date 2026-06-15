import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // OBRIŠI PROFIL
  const { error: profileDeleteError } = await auth.supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileDeleteError) {
    return authJson(auth, { error: profileDeleteError.message }, { status: 400 });
  }

  const adminSupabase = createSupabaseAdminClient();

  // OBRIŠI USERA IZ AUTH
  const { error: authDeleteError } = await adminSupabase.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    return authJson(auth, { error: authDeleteError.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    deletedUserId: userId,
  });
}
