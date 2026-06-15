import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId, name, description } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // UPDATE CLUB
  const { data, error } = await auth.supabase
    .from("clubs")
    .update({
      name,
      description,
    })
    .eq("id", clubId)
    .select()
    .single();

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    club: data,
  });
}
