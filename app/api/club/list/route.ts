
export const dynamic = "force-dynamic";

import { ADMIN_ROLES, authJson, requireRoles } from "@/utils/supabase/auth";

export async function GET(req: Request) {
  const auth = await requireRoles(req, ADMIN_ROLES);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // DOHVATI SVE KLUBOVE
  const { data: clubs, error } = await auth.supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    clubs,
  });
}
