"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireUserClubId } from "@/app/dashboard/members/_lib/server";
import type { Database } from "@/types/supabase";

type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];

export type MemberFormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof MemberFormValues, string>>;
};

export type MemberFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  active: boolean;
  club_role: "member" | "admin";
};

const memberFormSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required."),
  last_name: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone must be under 40 characters.")
    .optional()
    .transform((value) => value ?? ""),
  date_of_birth: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid birth date.",
    }),
  active: z.coerce.boolean().default(true),
  club_role: z.enum(["member", "admin"]).default("member"),
});

const memberIdSchema = z.coerce.number().int().positive();
type ParsedMemberFormValues = z.infer<typeof memberFormSchema>;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function parseMemberForm(formData: FormData) {
  return memberFormSchema.safeParse({
    first_name: getString(formData, "first_name"),
    last_name: getString(formData, "last_name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    date_of_birth: getString(formData, "date_of_birth"),
    active: formData.get("active") === "true",
    club_role: getString(formData, "club_role") || "member",
  });
}

function formError(error: z.ZodError<ParsedMemberFormValues>): MemberFormState {
  const flattened = error.flatten().fieldErrors;

  return {
    ok: false,
    message: "Check the highlighted fields.",
    fieldErrors: {
      first_name: flattened.first_name?.[0],
      last_name: flattened.last_name?.[0],
      email: flattened.email?.[0],
      phone: flattened.phone?.[0],
      date_of_birth: flattened.date_of_birth?.[0],
      active: flattened.active?.[0],
      club_role: flattened.club_role?.[0],
    },
  };
}

function cleanOptional(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

async function findAuthUserIdByEmail(
  supabase: Awaited<ReturnType<typeof requireUserClubId>>["supabase"],
  email: string
) {
  const normalizedEmail = email.trim().toLowerCase();

  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === normalizedEmail
    );

    if (user || data.users.length < 1000) {
      return user?.id ?? null;
    }
  }

  return null;
}

async function findProfileUserIdByEmail(
  supabase: Awaited<ReturnType<typeof requireUserClubId>>["supabase"],
  email: string
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}

async function resolveProfileUserId(
  supabase: Awaited<ReturnType<typeof requireUserClubId>>["supabase"],
  email: string
) {
  return (
    (await findProfileUserIdByEmail(supabase, email)) ??
    (await findAuthUserIdByEmail(supabase, email))
  );
}

async function upsertMemberProfileRole({
  supabase,
  clubId,
  userId,
  fullName,
  email,
  role,
}: {
  supabase: Awaited<ReturnType<typeof requireUserClubId>>["supabase"];
  clubId: string;
  userId: string;
  fullName: string;
  email: string;
  role: "member" | "admin";
}) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      email: email.trim().toLowerCase(),
      role,
      club_id: clubId,
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function createMember(
  _previousState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const parsed = parseMemberForm(formData);

  if (!parsed.success) {
    return formError(parsed.error);
  }

  const { supabase, clubId } = await requireUserClubId();

  if (!clubId) {
    return { ok: false, message: "Club not found." };
  }

  const fullName = `${parsed.data.first_name} ${parsed.data.last_name}`.trim();
  let profileUserId: string | null = null;

  try {
    profileUserId = await resolveProfileUserId(supabase, parsed.data.email);
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify the member user account.",
    };
  }

  if (parsed.data.club_role === "admin" && !profileUserId) {
    return {
      ok: false,
      message: "Admin rights can only be assigned to an existing user account.",
    };
  }

  const payload: MemberInsert = {
    club_id: clubId,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email,
    phone: cleanOptional(parsed.data.phone),
    date_of_birth: cleanOptional(parsed.data.date_of_birth),
    active: parsed.data.active,
  };

  const { error } = await supabase.from("members").insert(payload);

  if (error) {
    return { ok: false, message: error.message };
  }

  if (profileUserId) {
    try {
      await upsertMemberProfileRole({
        supabase,
        clubId,
        userId: profileUserId,
        fullName,
        email: parsed.data.email,
        role: parsed.data.club_role,
      });
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update the member club role.",
      };
    }
  }

  revalidatePath("/dashboard/members");
  redirect("/dashboard/members");
}

export async function updateMember(
  memberId: number | string,
  _previousState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const parsedId = memberIdSchema.safeParse(memberId);

  if (!parsedId.success) {
    return { ok: false, message: "Invalid member ID." };
  }

  const parsed = parseMemberForm(formData);

  if (!parsed.success) {
    return formError(parsed.error);
  }

  const { supabase, clubId } = await requireUserClubId();

  if (!clubId) {
    return { ok: false, message: "Club not found." };
  }

  const payload: MemberUpdate = {
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email,
    phone: cleanOptional(parsed.data.phone),
    date_of_birth: cleanOptional(parsed.data.date_of_birth),
    active: parsed.data.active,
  };

  const { error } = await supabase
    .from("members")
    .update(payload)
    .eq("id", parsedId.data)
    .eq("club_id", clubId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/members");
  revalidatePath(`/dashboard/members/${parsedId.data}`);
  redirect(`/dashboard/members/${parsedId.data}`);
}
