/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  ArrowUpTrayIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  UserCircleIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import {
  getClubForUser,
  getMemberStats,
  getRecentActivity,
  requireDashboardUser,
  type DashboardClub,
  type MemberStats,
  type RecentActivity,
} from "@/app/dashboard/data";

export const dynamic = "force-dynamic";

type StatCardProps = {
  label: string;
  value: string | number;
  helper: string;
  icon: typeof UserGroupIcon;
  accent: string;
};

const quickActions = [
  {
    href: "/dashboard/members/add",
    label: "Add Member",
    description: "Create a new member profile.",
    icon: PlusIcon,
  },
  {
    href: "/dashboard/members",
    label: "View Members",
    description: "Search and manage club members.",
    icon: UserGroupIcon,
  },
  {
    href: "/dashboard/club/edit",
    label: "Edit Club",
    description: "Update club details and contact info.",
    icon: PencilSquareIcon,
  },
  {
    href: "/dashboard/club/logo",
    label: "Upload Logo",
    description: "Refresh your club branding.",
    icon: ArrowUpTrayIcon,
  },
];

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function StatCard({ label, value, helper, icon: Icon, accent }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-5 text-4xl font-bold text-white">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400">{helper}</p>
    </article>
  );
}

function ClubOverview({ club }: { club: DashboardClub }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
          {club.logo_url ? (
            <img
              src={club.logo_url}
              alt={`${club.name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserGroupIcon className="h-12 w-12 text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Club overview
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {club.name}
          </h2>
          <p className="mt-2 text-slate-400">
            {[club.city, club.country].filter(Boolean).join(", ") ||
              "Location not set"}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[28rem]">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Owner
            </p>
            <p className="mt-2 font-semibold text-white">
              {club.owner?.full_name || club.owner?.email || "Not assigned"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Created
            </p>
            <p className="mt-2 font-semibold text-white">
              {formatDate(club.created_at)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentActivityList({
  activities,
}: {
  activities: RecentActivity[];
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Recent activity
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Recent Members Added
          </h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
          Latest 5 entries
        </span>
      </div>

      <div className="mt-8 space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
            >
              <div className="mt-1 h-3 w-3 rounded-full bg-blue-300 shadow-lg shadow-blue-400/40" />
              <div>
                <p className="font-medium text-white">{activity.description}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {activity.action} - {formatDate(activity.created_at)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-6 text-center text-slate-400">
            No recent member activity yet.
          </div>
        )}
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Quick actions
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Manage your club
        </h2>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-blue-200/40 hover:bg-blue-300/10"
            >
              <span className="rounded-2xl bg-blue-300/10 p-3 text-blue-100">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-white">
                  {action.label}
                </span>
                <span className="text-sm text-slate-400">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function EmptyClubDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-8 shadow-xl shadow-black/20">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-100">
            Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Club not found
          </h1>
          <p className="mt-4 max-w-2xl text-amber-100/80">
            Your profile is not assigned to a club yet, so dashboard metrics
            cannot be loaded.
          </p>
        </section>
      </div>
    </main>
  );
}

function buildStats(stats: MemberStats) {
  return [
    {
      label: "Total Members",
      value: stats.totalMembers,
      helper: "All members in your club.",
      icon: UserGroupIcon,
      accent: "bg-blue-300/10 text-blue-100",
    },
    {
      label: "Active Members",
      value: stats.activeMembers,
      helper: "Members marked active.",
      icon: CheckCircleIcon,
      accent: "bg-emerald-300/10 text-emerald-100",
    },
    {
      label: "Inactive Members",
      value: stats.inactiveMembers,
      helper: "Members currently inactive.",
      icon: XCircleIcon,
      accent: "bg-slate-300/10 text-slate-200",
    },
    {
      label: "Club Age",
      value: `${stats.clubAgeDays}d`,
      helper: "Days since the club was created.",
      icon: CalendarDaysIcon,
      accent: "bg-amber-300/10 text-amber-100",
    },
  ];
}

export default async function DashboardPage() {
  const user = await requireDashboardUser();
  const club = await getClubForUser(user.id);

  if (!club) {
    return <EmptyClubDashboard />;
  }

  const [stats, activities] = await Promise.all([
    getMemberStats(club.id, club.created_at),
    getRecentActivity(club.id),
  ]);
  const statCards = buildStats(stats);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.28),transparent_32rem)]" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-200">
                  Dashboard home
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Welcome back to {club.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Live club metrics, recent member activity, and daily
                  management shortcuts are scoped to your authenticated club.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-200">
                <p className="font-semibold text-white">Today&apos;s focus</p>
                <p className="mt-1 text-slate-300">
                  Keep member records and club details current.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ClubOverview club={club} />

        <section
          aria-label="Dashboard statistics"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {statCards.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <RecentActivityList activities={activities} />
          <QuickActions />
        </div>
      </div>
    </main>
  );
}
