export const dynamic = "force-dynamic";

import { requireUser } from "@/lib/api/auth";
import { throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const GET = withApiHandler(async (request) => {
  await requireUser(request);

  const supabase = createSupabaseAdminClient();
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);

  return successResponse({ clubs });
});
