import { getCurrentUser } from "@/lib/api/auth";
import { withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export const POST = withApiHandler(async (request) => {
  const { user, applyCookies } = await getCurrentUser(request);

  return applyCookies(
    successResponse({
      valid: Boolean(user),
      user: user ?? null,
    })
  );
});
