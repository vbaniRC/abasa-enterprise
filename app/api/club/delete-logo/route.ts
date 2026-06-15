import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId } = body;
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // DELETE CLUB LOGO FROM STORAGE (optional)
  await auth.supabase.storage.from("club-logos").remove([`${clubId}.png`]);

  // DELETE CLUB FROM DB
  const { error } = await auth.supabase
    .from("clubs")
    .delete()
    .eq("id", clubId);

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, { success: true });
}
