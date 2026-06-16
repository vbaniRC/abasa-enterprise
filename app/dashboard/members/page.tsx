import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { SearchBar } from "@/app/dashboard/members/_components/SearchBar";
import { StatusFilter } from "@/app/dashboard/members/_components/StatusFilter";
import {
  EmptyMembersState,
  MembersCard,
  MembersShell,
  StatusBadge,
} from "@/app/dashboard/members/_components/member-ui";
import { getMembers } from "@/app/dashboard/members/_lib/actions";
import type { MemberStatus } from "@/app/dashboard/members/_lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value: string | undefined): MemberStatus | "all" {
  if (value === "active" || value === "inactive" || value === "pending") {
    return value;
  }

  return "all";
}

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

function pageHref(page: number, search: string, status: MemberStatus | "all") {
  const params = new URLSearchParams({ page: String(page) });

  if (search) {
    params.set("search", search);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  return `/dashboard/members?${params.toString()}`;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const search = paramValue(searchParams?.search)?.trim() ?? "";
  const status = parseStatus(paramValue(searchParams?.status));
  const page = Math.max(1, Number(paramValue(searchParams?.page) ?? "1") || 1);
  const result = await getMembers({ page, search, status });

  return (
    <MembersShell
      title="Members"
      description="Search, filter, and review members assigned to your authenticated club."
      action={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-200">
            <p className="font-semibold text-white">{result.count} members</p>
            <p className="mt-1 text-slate-300">Single-club member directory</p>
          </div>
          <Link
            href="/dashboard/members/add"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            <PlusIcon className="h-5 w-5" />
            Add Member
          </Link>
        </div>
      }
    >
      <MembersCard>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Directory
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Club members
            </h2>
          </div>
          <div className="flex w-full flex-col gap-4 xl:max-w-3xl">
            <SearchBar defaultValue={result.search} />
            <StatusFilter value={result.status} />
          </div>
        </div>
      </MembersCard>

      <MembersCard>
        {!result.clubFound ? (
          <EmptyMembersState
            title="Club not found"
            message="Your profile is not assigned to a club yet, so members cannot be listed."
          />
        ) : result.members.length === 0 ? (
          <EmptyMembersState message="No members match the current search and filters." />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created at</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {result.members.map((member) => (
                  <tr key={member.id} className="bg-slate-950/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white/10 p-2">
                          <UserGroupIcon className="h-5 w-5 text-blue-200" />
                        </div>
                        <span className="font-semibold text-white">
                          {member.first_name} {member.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {member.email || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {member.phone || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {formatDate(member.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/members/${member.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Page {Math.min(result.page, result.totalPages)} of{" "}
            {result.totalPages}
          </p>
          <div className="flex gap-3">
            <Link
              href={pageHref(Math.max(1, result.page - 1), result.search, result.status)}
              aria-disabled={result.page <= 1}
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition ${
                result.page <= 1
                  ? "pointer-events-none text-slate-600"
                  : "text-slate-200 hover:border-white/25 hover:text-white"
              }`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Link>
            <Link
              href={pageHref(
                Math.min(result.totalPages, result.page + 1),
                result.search,
                result.status
              )}
              aria-disabled={result.page >= result.totalPages}
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition ${
                result.page >= result.totalPages
                  ? "pointer-events-none text-slate-600"
                  : "text-slate-200 hover:border-white/25 hover:text-white"
              }`}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </MembersCard>
    </MembersShell>
  );
}
