import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, role } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // UPDATE ROLE
  const { data, error } = await auth.supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    updatedUser: data,
  });
}
