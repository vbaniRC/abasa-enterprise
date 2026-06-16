import Link from "next/link";

import {
  ClubCard,
  ClubShell,
  EmptyClubState,
  StatusBanner,
} from "@/app/dashboard/club/_components/ClubShell";
import { updateClubAction } from "@/app/dashboard/club/_lib/actions";
import { getClubContext } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const fields = [
  { name: "name", label: "Club name", type: "text", required: true },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "email", label: "Email", type: "email" },
] as const;

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditClubPage({ searchParams }: PageProps) {
  const { club } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  const success = paramValue(searchParams?.success);
  const error = paramValue(searchParams?.error);

  return (
    <ClubShell
      title="Edit club"
      description="Update the single club profile shown across your dashboard."
      backHref="/dashboard/club"
      action={
        <Link
          href="/dashboard/club"
          className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
        >
          Cancel
        </Link>
      }
    >
      <ClubCard
        title="Club details"
        description="Required fields are validated before the server action saves changes."
      >
        <div className="mb-6">
          <StatusBanner success={success} error={error} />
        </div>

        <form action={updateClubAction} className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="text-sm font-medium text-slate-300">
                {field.label}
              </span>
              <input
                name={field.name}
                type={field.type}
                required={"required" in field ? field.required : false}
                defaultValue={club[field.name] ?? ""}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
              />
            </label>
          ))}

          <div className="flex items-center gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              Save changes
            </button>
            <Link
              href="/dashboard/club"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
            >
              Back to overview
            </Link>
          </div>
        </form>
      </ClubCard>
    </ClubShell>
  );
}
