import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, full_name, avatar_url, role, club_id } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // UPDATE PROFILE
  const { data, error } = await auth.supabase
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

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    updatedUser: data,
  });
}
