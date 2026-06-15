import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, full_name, club_id } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const adminSupabase = createSupabaseAdminClient();

  // KREIRAJ USERA
  const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return authJson(auth, { error: createError.message }, { status: 400 });
  }

  // KREIRAJ PROFIL
  const { error: profileInsertError } = await auth.supabase
    .from("profiles")
    .insert({
      id: newUser.user.id,
      full_name,
      role: "coach",
      club_id,
    });

  if (profileInsertError) {
    return authJson(auth, { error: profileInsertError.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    user: newUser.user,
  });
}
