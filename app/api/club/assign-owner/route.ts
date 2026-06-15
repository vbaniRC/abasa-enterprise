import { authJson, requireRoles } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { clubId, userId } = body;
  const auth = await requireRoles(req, ["superadmin"]);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // UPDATE OWNER
  const { error } = await auth.supabase
    .from("clubs")
    .update({ owner_id: userId })
    .eq("id", clubId);

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, { success: true });
}
