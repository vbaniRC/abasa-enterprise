import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type ClubShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  backHref?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ClubShell({
  eyebrow = "Club settings",
  title,
  description,
  backHref,
  action,
  children,
}: ClubShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_30rem)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                {backHref ? (
                  <Link
                    href={backHref}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to club
                  </Link>
                ) : null}
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-200">
                  {eyebrow}
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  {description}
                </p>
              </div>
              {action}
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}

export function ClubCard({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
      {title || description ? (
        <div className="mb-6">
          {title ? (
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function EmptyClubState() {
  return (
    <ClubShell
      title="Club not found"
      description="No club is currently owned by the authenticated user."
    >
      <ClubCard>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
          Club not found. Create or assign a club before managing settings.
        </div>
      </ClubCard>
    </ClubShell>
  );
}

export function StatusBanner({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        success
          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
          : "border-rose-300/25 bg-rose-300/10 text-rose-100"
      }`}
    >
      {success || error}
    </div>
  );
}
