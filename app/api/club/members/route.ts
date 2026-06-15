export const dynamic = "force-dynamic";

import { requireUser } from "@/lib/api/auth";
import { notFound, throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const GET = withApiHandler(async (request) => {
  const user = await requireUser(request);
  const supabase = createSupabaseAdminClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("club_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw notFound("Profile not found");
  }

  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("*")
    .eq("club_id", profile.club_id)
    .order("created_at", { ascending: false });

  throwIfSupabaseError(membersError);

  return successResponse({ members });
});
