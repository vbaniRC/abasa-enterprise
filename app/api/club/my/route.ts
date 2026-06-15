import { authJson, requireUser } from "@/utils/supabase/auth";

export async function GET(req: Request) {
  const auth = await requireUser(req);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { data: profile, error: profileError } = await auth.supabase
    .from("profiles")
    .select("club_id")
    .eq("id", auth.user.id)
    .single();

  if (profileError) {
    return authJson(auth, { error: profileError.message }, { status: 400 });
  }

  if (!profile?.club_id) {
    return authJson(auth, { success: true, club: null });
  }

  const { data: club, error } = await auth.supabase
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, { success: true, club });
}
