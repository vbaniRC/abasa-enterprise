export const dynamic = "force-dynamic";
import { authJson, requireUser } from "@/utils/supabase/auth";

export async function GET(req: Request) {
  const auth = await requireUser(req);

  if ("errorResponse" in auth) {
    return authJson({ response: auth.errorResponse }, { user: null });
  }

  // DOHVATI PROFIL
  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  return authJson(auth, {
    success: true,
    user: auth.user,
    profile,
  });
}
