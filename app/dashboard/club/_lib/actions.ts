"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  findAuthUserByEmail,
  getClubContext,
} from "@/app/dashboard/club/_lib/data";

const optionalText = z
  .string()
  .trim()
  .max(180, "Keep this field under 180 characters.")
  .transform((value) => (value.length > 0 ? value : null));

const clubUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Club name must be at least 2 characters.")
      .max(120, "Club name must be under 120 characters."),
    address: optionalText,
    city: optionalText,
    country: optionalText,
    phone: optionalText,
    email: optionalText.refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email address."
    ),
  });

const coachEmailSchema = z
  .string()
  .trim()
  .email("Enter a valid coach email address.");

const profileIdSchema = z.string().trim().min(1, "Missing coach profile ID.");

const logoUrlSchema = z
  .string()
  .trim()
  .url("Logo URL must be a valid public URL.")
  .max(2048, "Logo URL is too long.");

function statePath(
  path: string,
  type: "success" | "error",
  message: string
) {
  return `${path}?${new URLSearchParams({ [type]: message }).toString()}`;
}

async function requireClub(path: string) {
  const context = await getClubContext();

  if (!context.club) {
    redirect(statePath(path, "error", "Club not found."));
  }

  return {
    ...context,
    club: context.club,
  };
}

export async function updateClubAction(formData: FormData) {
  const parsed = clubUpdateSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(
      statePath(
        "/dashboard/club/edit",
        "error",
        parsed.error.issues[0]?.message ?? "Check the form fields."
      )
    );
  }

  const { supabase, club, user } = await requireClub("/dashboard/club/edit");
  const { error } = await supabase
    .from("clubs")
    .update(parsed.data)
    .eq("id", club.id)
    .eq("owner_id", user.id);

  if (error) {
    redirect(statePath("/dashboard/club/edit", "error", error.message));
  }

  revalidatePath("/dashboard/club");
  redirect(statePath("/dashboard/club/edit", "success", "Club updated."));
}

export async function addCoachAction(formData: FormData) {
  const parsed = coachEmailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    redirect(
      statePath(
        "/dashboard/club/roles",
        "error",
        parsed.error.issues[0]?.message ?? "Enter a valid coach email."
      )
    );
  }

  const { supabase, club } = await requireClub("/dashboard/club/roles");
  const coachUser = await findAuthUserByEmail(supabase, parsed.data);

  if (!coachUser) {
    redirect(
      statePath(
        "/dashboard/club/roles",
        "error",
        "No user profile exists for that email."
      )
    );
  }

  const fullName =
    typeof coachUser.user_metadata?.full_name === "string"
      ? coachUser.user_metadata.full_name
      : coachUser.email ?? "Coach";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: coachUser.id,
      full_name: fullName,
      role: "coach",
      club_id: club.id,
    },
    { onConflict: "id" }
  );

  if (error) {
    redirect(statePath("/dashboard/club/roles", "error", error.message));
  }

  revalidatePath("/dashboard/club/roles");
  redirect(statePath("/dashboard/club/roles", "success", "Coach added."));
}

export async function removeCoachAction(formData: FormData) {
  const parsed = profileIdSchema.safeParse(formData.get("profileId"));

  if (!parsed.success) {
    redirect(statePath("/dashboard/club/roles", "error", "Coach not found."));
  }

  const { supabase, club } = await requireClub("/dashboard/club/roles");

  if (parsed.data === club.owner_id) {
    redirect(
      statePath("/dashboard/club/roles", "error", "Owner role is read-only.")
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: "member" })
    .eq("id", parsed.data)
    .eq("club_id", club.id)
    .eq("role", "coach");

  if (error) {
    redirect(statePath("/dashboard/club/roles", "error", error.message));
  }

  revalidatePath("/dashboard/club/roles");
  redirect(statePath("/dashboard/club/roles", "success", "Coach removed."));
}

export async function updateClubLogoAction(logoUrl: string) {
  const parsed = logoUrlSchema.safeParse(logoUrl);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid logo URL.",
    };
  }

  const { supabase, club, user } = await requireClub("/dashboard/club/logo");
  const { error } = await supabase
    .from("clubs")
    .update({ logo_url: parsed.data })
    .eq("id", club.id)
    .eq("owner_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/club");
  revalidatePath("/dashboard/club/logo");

  return { ok: true, message: "Logo updated." };
}
