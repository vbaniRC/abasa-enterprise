import {
  ShieldCheckIcon,
  TrashIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import {
  ClubCard,
  ClubShell,
  EmptyClubState,
  StatusBanner,
} from "@/app/dashboard/club/_components/ClubShell";
import {
  addCoachAction,
  removeCoachAction,
} from "@/app/dashboard/club/_lib/actions";
import { getClubCoaches, getClubContext } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function display(value?: string | null) {
  return value && value.trim().length > 0 ? value : "-";
}

export default async function ClubRolesPage({ searchParams }: PageProps) {
  const { club, owner, supabase } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  const coaches = await getClubCoaches(supabase, club.id);
  const success = paramValue(searchParams?.success);
  const error = paramValue(searchParams?.error);

  return (
    <ClubShell
      title="Roles"
      description="Review the read-only owner role and manage coaches assigned to this club."
      backHref="/dashboard/club"
    >
      <StatusBanner success={success} error={error} />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ClubCard title="Owner" description="The club owner is tied to ownership and cannot be removed here.">
          <div className="flex items-start gap-4 rounded-2xl border border-blue-300/25 bg-blue-300/10 p-5">
            <UserCircleIcon className="h-10 w-10 text-blue-100" />
            <div>
              <p className="text-lg font-semibold text-white">
                {display(owner?.full_name)}
              </p>
              <p className="mt-1 text-sm text-blue-100/80">
                {display(owner?.email)}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                <ShieldCheckIcon className="h-4 w-4" />
                Owner
              </span>
            </div>
          </div>
        </ClubCard>

        <ClubCard title="Add coach" description="Assign an existing authenticated user to this club as a coach.">
          <form action={addCoachAction} className="flex flex-col gap-4 sm:flex-row">
            <label className="flex-1">
              <span className="text-sm font-medium text-slate-300">
                Coach email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="coach@example.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-200/60 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              <UserPlusIcon className="h-5 w-5" />
              Add coach
            </button>
          </form>
        </ClubCard>
      </section>

      <ClubCard
        title="Coaches"
        description="Coaches are loaded from profiles where role is coach and club_id matches this club."
      >
        <div className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="flex flex-col gap-4 bg-slate-950/40 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white/10 p-3">
                  <UserCircleIcon className="h-7 w-7 text-slate-300" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {display(coach.full_name)}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {display(coach.email)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                  Coach
                </span>
                <form action={removeCoachAction}>
                  <input type="hidden" name="profileId" value={coach.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full border border-rose-300/25 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}

          {coaches.length === 0 ? (
            <div className="bg-slate-950/40 p-6 text-center text-slate-400">
              No coaches assigned yet.
            </div>
          ) : null}
        </div>
      </ClubCard>
    </ClubShell>
  );
}
