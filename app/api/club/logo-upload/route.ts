import { requireUser } from "@/lib/api/auth";
import { badRequest, throwIfSupabaseError, withApiHandler } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { clubIdSchema } from "@/lib/api/schemas";
import { parseFormBody } from "@/lib/api/validation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const POST = withApiHandler(async (request) => {
  const {
    data: { clubId },
    formData,
  } = await parseFormBody(request, clubIdSchema);
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    throw badRequest("Missing file or clubId");
  }

  await requireUser(request);

  const supabase = createSupabaseAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("club-logos")
    .upload(`${clubId}.png`, buffer, {
      upsert: true,
      contentType: file.type,
    });

  throwIfSupabaseError(uploadError);

  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/club-logos/${clubId}.png`;
  const { error: dbError } = await supabase
    .from("clubs")
    .update({
      logo_url: logoUrl,
    })
    .eq("id", clubId);

  throwIfSupabaseError(dbError);

  return successResponse({ logoUrl });
});
