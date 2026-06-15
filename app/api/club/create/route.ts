import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // CREATE CLUB
  const { data, error } = await auth.supabase
    .from("clubs")
    .insert({
      name,
      description,
      owner_id: auth.user.id,
    })
    .select()
    .single();

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, { success: true, club: data });
}
