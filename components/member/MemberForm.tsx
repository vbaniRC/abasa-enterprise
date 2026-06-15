"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { z } from "zod";

import type {
  MemberFormState,
  MemberFormValues,
} from "@/app/dashboard/members/actions";
import type { MemberRecord } from "@/app/dashboard/members/_lib/types";

type MemberFormProps = {
  mode: "create" | "edit";
  initialData?: MemberRecord;
  onSubmit: (
    previousState: MemberFormState,
    formData: FormData
  ) => Promise<MemberFormState>;
};

const clientSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required."),
  last_name: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  date_of_birth: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid birth date.",
    }),
  active: z.boolean(),
});

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? mode === "create"
          ? "Creating..."
          : "Saving..."
        : mode === "create"
          ? "Create member"
          : "Save changes"}
    </button>
  );
}

function fieldValue(initialData: MemberRecord | undefined, key: keyof MemberFormValues) {
  if (!initialData) {
    return key === "active" ? true : "";
  }

  if (key === "date_of_birth") {
    return initialData.date_of_birth ?? "";
  }

  if (key === "active") {
    return initialData.active;
  }

  return initialData[key] ?? "";
}

export function MemberForm({ mode, initialData, onSubmit }: MemberFormProps) {
  const initialValues = useMemo<MemberFormValues>(
    () => ({
      first_name: String(fieldValue(initialData, "first_name")),
      last_name: String(fieldValue(initialData, "last_name")),
      email: String(fieldValue(initialData, "email")),
      phone: String(fieldValue(initialData, "phone")),
      date_of_birth: String(fieldValue(initialData, "date_of_birth")),
      active: Boolean(fieldValue(initialData, "active")),
    }),
    [initialData]
  );
  const [values, setValues] = useState<MemberFormValues>(initialValues);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof MemberFormValues, string>>
  >({});
  const [state, formAction] = useFormState(onSubmit, {
    ok: false,
    message: "",
  });

  function updateField<K extends keyof MemberFormValues>(
    key: K,
    value: MemberFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setClientErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validateBeforeSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = clientSchema.safeParse(values);

    if (parsed.success) {
      setClientErrors({});
      return;
    }

    event.preventDefault();
    const flattened = parsed.error.flatten().fieldErrors;
    setClientErrors({
      first_name: flattened.first_name?.[0],
      last_name: flattened.last_name?.[0],
      email: flattened.email?.[0],
      phone: flattened.phone?.[0],
      date_of_birth: flattened.date_of_birth?.[0],
      active: flattened.active?.[0],
    });
  }

  const errors = { ...state.fieldErrors, ...clientErrors };

  return (
    <form action={formAction} onSubmit={validateBeforeSubmit} className="space-y-6">
      {state.message ? (
        <div
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
              : "border-rose-300/25 bg-rose-300/10 text-rose-100"
          }`}
        >
          {state.ok ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <ExclamationCircleIcon className="h-5 w-5" />
          )}
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">First name</span>
          <input
            name="first_name"
            value={values.first_name}
            onChange={(event) => updateField("first_name", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
            required
          />
          {errors.first_name ? (
            <p className="mt-2 text-sm text-rose-200">{errors.first_name}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Last name</span>
          <input
            name="last_name"
            value={values.last_name}
            onChange={(event) => updateField("last_name", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
            required
          />
          {errors.last_name ? (
            <p className="mt-2 text-sm text-rose-200">{errors.last_name}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
            required
          />
          {errors.email ? (
            <p className="mt-2 text-sm text-rose-200">{errors.email}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">Phone</span>
          <input
            name="phone"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
          />
          {errors.phone ? (
            <p className="mt-2 text-sm text-rose-200">{errors.phone}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-300">
            Date of birth
          </span>
          <input
            name="date_of_birth"
            type="date"
            value={values.date_of_birth}
            onChange={(event) =>
              updateField("date_of_birth", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
          />
          {errors.date_of_birth ? (
            <p className="mt-2 text-sm text-rose-200">
              {errors.date_of_birth}
            </p>
          ) : null}
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-slate-300">
              Active
            </span>
            <span className="text-sm text-slate-500">
              Inactive members stay visible but are filtered separately.
            </span>
          </span>
          <select
            name="active"
            value={String(values.active)}
            onChange={(event) => updateField("active", event.target.value === "true")}
            className="rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm text-white focus:border-blue-200/60 focus:outline-none"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton mode={mode} />
        <Link
          href="/dashboard/members"
          className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
