import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import {
  ClubCard,
  ClubShell,
  EmptyClubState,
} from "@/app/dashboard/club/_components/ClubShell";
import { MemberSearch } from "@/app/dashboard/club/_components/MemberSearch";
import { getClubContext, getClubMembers } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const PAGE_SIZE = 10;

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function pageHref(page: number, search: string) {
  const params = new URLSearchParams({ page: String(page) });

  if (search) {
    params.set("search", search);
  }

  return `/dashboard/club/members?${params.toString()}`;
}

export default async function ClubMembersPage({ searchParams }: PageProps) {
  const { club, supabase } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  const search = paramValue(searchParams?.search)?.trim() ?? "";
  const page = Math.max(1, Number(paramValue(searchParams?.page) ?? "1") || 1);
  const { members, count } = await getClubMembers(supabase, club.id, {
    page,
    search,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <ClubShell
      title="Club members"
      description="Search and page through member profiles assigned to this single club."
      backHref="/dashboard/club"
    >
      <ClubCard>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Members
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {count} total
            </h2>
          </div>
          <div className="w-full lg:max-w-xl">
            <MemberSearch defaultValue={search} />
          </div>
        </div>
      </ClubCard>

      <ClubCard>
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-5 py-4 font-semibold">Name</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {members.map((member) => (
                <tr key={member.id} className="bg-slate-950/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/10 p-2">
                        <UserGroupIcon className="h-5 w-5 text-blue-200" />
                      </div>
                      <span className="font-semibold text-white">
                        {member.full_name || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {member.email || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                      {member.display_status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {formatDate(member.display_joined_at)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/club/members/${member.id}`}
                      className="text-sm font-semibold text-blue-200 transition hover:text-white"
                    >
                      View placeholder
                    </Link>
                  </td>
                </tr>
              ))}

              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="bg-slate-950/40 px-5 py-10 text-center text-slate-400"
                  >
                    No members found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Page {Math.min(page, totalPages)} of {totalPages}
          </p>
          <div className="flex gap-3">
            <Link
              href={pageHref(Math.max(1, page - 1), search)}
              aria-disabled={page <= 1}
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition ${
                page <= 1
                  ? "pointer-events-none text-slate-600"
                  : "text-slate-200 hover:border-white/25 hover:text-white"
              }`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Link>
            <Link
              href={pageHref(Math.min(totalPages, page + 1), search)}
              aria-disabled={page >= totalPages}
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition ${
                page >= totalPages
                  ? "pointer-events-none text-slate-600"
                  : "text-slate-200 hover:border-white/25 hover:text-white"
              }`}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </ClubCard>
    </ClubShell>
  );
}
