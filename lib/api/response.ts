import { NextResponse } from "next/server";

type JsonObject = Record<string, unknown>;

type ErrorResponseOptions = {
  status?: number;
  code?: string;
  details?: unknown;
};

export function successResponse<T extends JsonObject>(
  data?: T,
  init?: ResponseInit
) {
  const responseData = data ?? ({} as T);

  return NextResponse.json(
    {
      success: true,
      data: responseData,
      ...responseData,
    },
    init
  );
}

export function errorResponse(
  message: string,
  { status = 500, code = "INTERNAL_SERVER_ERROR", details }: ErrorResponseOptions = {}
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status }
  );
}
