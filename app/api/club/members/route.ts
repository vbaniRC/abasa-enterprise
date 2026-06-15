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

  // DOHVATI SVE ČLANOVE KLUBA
  const { data: members, error: membersError } = await auth.supabase
    .from("profiles")
    .select("*")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  if (membersError) {
    return authJson(auth, { error: membersError.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    members,
  });
}
