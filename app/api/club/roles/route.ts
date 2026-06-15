import { withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";

export const GET = withApiHandler(async () => {
  const roles = [
    "superadmin",
    "owner",
    "admin",
    "coach",
    "parent",
    "member",
  ];

  return successResponse({
    message: "Roles fetched successfully",
    roles,
  });
});
