import { z } from "zod";

import { badRequest } from "@/lib/api/errors";

export async function parseJsonBody<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw badRequest("Invalid JSON body", "INVALID_JSON");
  }

  return schema.parse(body);
}

export async function parseFormBody<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema
): Promise<{ data: z.infer<TSchema>; formData: FormData }> {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  return {
    data: schema.parse(body),
    formData,
  };
}
