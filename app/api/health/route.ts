import { withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  return successResponse({ status: "ok" });
});
