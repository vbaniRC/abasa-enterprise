"use client";

import { useAuth } from "../providers/AuthProvider";

const stats = [
  {
    label: "Active members",
    value: "--",
    helper: "Member count placeholder",
  },
  {
    label: "Sessions this week",
    value: "--",
    helper: "Schedule summary placeholder",
  },
  {
    label: "Pending payments",
    value: "--",
    helper: "Billing status placeholder",
  },
];

const activities = [
  "Recent check-in activity will appear here.",
  "New registrations will appear here.",
  "Payment and notification updates will appear here.",
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const displayName =
    user?.user_metadata?.full_name || user?.email || "your team";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.28),transparent_32rem)]" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-200">
                  ABASA dashboard
                </p>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-5xl">
                  Welcome back, {loading ? "..." : displayName}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Your club overview is ready for member insights, attendance
                  trends, and premium reporting once live data is connected.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-200">
                <p className="font-semibold text-white">Today&apos;s focus</p>
                <p className="mt-1 text-slate-300">
                  Placeholder workspace for priorities and next actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="Dashboard statistics"
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20"
            >
              <p className="text-sm font-medium text-slate-300">{stat.label}</p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <p className="text-4xl font-bold text-white">{stat.value}</p>
                <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-medium text-blue-100">
                  Placeholder
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-400">{stat.helper}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
                Recent activity
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Activity feed placeholder
              </h2>
            </div>
            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
              Live data coming soon
            </span>
          </div>

          <div className="mt-8 space-y-4">
            {activities.map((activity) => (
              <div
                key={activity}
                className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
              >
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-300 shadow-lg shadow-blue-400/40" />
                <div>
                  <p className="font-medium text-white">{activity}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Placeholder entry prepared for future timeline data.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
