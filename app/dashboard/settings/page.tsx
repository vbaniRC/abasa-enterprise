import Link from "next/link";

import {
  ClubCard,
  ClubShell,
  EmptyClubState,
} from "@/app/dashboard/club/_components/ClubShell";
import { getClubContext } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function valueOrDash(value: string | null | undefined) {
  return value || "-";
}

export default async function SettingsPage() {
  const { user, club, profile } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  const displayName =
    profile?.full_name ||
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    "User";

  return (
    <ClubShell
      title="Settings"
      description="Manage account details and club configuration for your authenticated dashboard."
    >
      <ClubCard title="Account settings">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Name</p>
            <p className="mt-2 text-lg font-semibold text-white">{displayName}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Email</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {valueOrDash(user.email ?? profile?.email)}
            </p>
          </div>
        </div>
      </ClubCard>

      <ClubCard title="Club settings">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Club name</p>
            <p className="mt-2 text-lg font-semibold text-white">{club.name}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Location</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {[club.city, club.country].filter(Boolean).join(", ") || "-"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/club/edit"
            className="rounded-full bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Edit club details
          </Link>
          <Link
            href="/dashboard/club/logo"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
          >
            Manage logo
          </Link>
          <Link
            href="/dashboard/club/roles"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
          >
            Manage roles
          </Link>
        </div>
      </ClubCard>
    </ClubShell>
  );
}
