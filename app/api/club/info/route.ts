export const dynamic = "force-dynamic";
import { authJson, requireUser } from "@/utils/supabase/auth";

export async function GET(req: Request) {
  const auth = await requireUser(req);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // DOHVATI PROFIL
  const { data: profile, error: profileError } = await auth.supabase
    .from("profiles")
    .select("club_id")
    .eq("id", auth.user.id)
    .single();

  if (profileError || !profile) {
    return authJson(
      auth,
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  // DOHVATI KLUB
  const { data: club, error: clubError } = await auth.supabase
    .from("clubs")
    .select("*")
    .eq("id", profile.club_id)
    .single();

  if (clubError || !club) {
    return authJson(
      auth,
      { error: "Club not found" },
      { status: 404 }
    );
  }

  return authJson(auth, {
    success: true,
    club,
  });
}
