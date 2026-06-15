import { authJson, requireUser } from "@/utils/supabase/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { full_name, avatar_url, additional_data } = body;
  const auth = await requireUser(req);

  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  // UPDATE PROFILE
  const { data, error } = await auth.supabase
    .from("profiles")
    .update({
      full_name,
      avatar_url,
      additional_data,
    })
    .eq("id", auth.user.id)
    .select()
    .single();

  if (error) {
    return authJson(auth, { error: error.message }, { status: 400 });
  }

  return authJson(auth, {
    success: true,
    profile: data,
  });
}
