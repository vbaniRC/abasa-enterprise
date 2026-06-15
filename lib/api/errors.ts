import { ZodError } from "zod";

import { errorResponse } from "@/lib/api/response";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    status = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(
  message: string,
  code = "BAD_REQUEST",
  details?: unknown
) {
  return new ApiError(message, 400, code, details);
}

export function unauthorized(message = "Unauthorized") {
  return new ApiError(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "Forbidden") {
  return new ApiError(message, 403, "FORBIDDEN");
}

export function notFound(message: string) {
  return new ApiError(message, 404, "NOT_FOUND");
}

export function throwIfSupabaseError(
  error: { message?: string } | null | undefined,
  status = 400
) {
  if (error) {
    throw new ApiError(
      error.message ?? "Supabase request failed",
      status,
      "SUPABASE_ERROR"
    );
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return errorResponse(error.message, {
      status: error.status,
      code: error.code,
      details: error.details,
    });
  }

  if (error instanceof ZodError) {
    return errorResponse("Invalid request body", {
      status: 400,
      code: "VALIDATION_ERROR",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  console.error("Unhandled API error:", error);

  return errorResponse("Internal server error");
}

export function withApiHandler<TContext = unknown>(
  handler: (request: Request, context: TContext) => Promise<Response>
) {
  return async (request: Request, context: TContext) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
