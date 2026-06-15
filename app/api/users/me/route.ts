import { requireUser } from "@/lib/api/auth";
import { successResponse } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/errors";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const GET = withApiHandler(async (request) => {
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return successResponse({
    canonical: "/api/auth/me",
    user,
    profile: profile ?? null,
  });
});
