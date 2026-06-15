import { authJson, requireUser } from "@/utils/supabase/auth";

export async function GET(req: Request) {
  const auth = await requireUser(req);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { data: profile, error } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, { success: true, user: auth.user, profile });
}
