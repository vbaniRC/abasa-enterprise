import Link from "next/link";
import { notFound } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";

import {
  ClubCard,
  ClubShell,
  EmptyClubState,
} from "@/app/dashboard/club/_components/ClubShell";
import { getClubContext, getClubMember } from "@/app/dashboard/club/_lib/data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

export default async function ClubMemberDetailPlaceholder({ params }: PageProps) {
  const { club, supabase } = await getClubContext();

  if (!club) {
    return <EmptyClubState />;
  }

  const member = await getClubMember(supabase, club.id, params.id);

  if (!member) {
    notFound();
  }

  return (
    <ClubShell
      title="Member detail"
      description="Placeholder route for the future member detail experience."
      backHref="/dashboard/club/members"
    >
      <ClubCard>
        <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-950/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-3">
              <UserCircleIcon className="h-8 w-8 text-blue-200" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">
                {member.full_name || "Unnamed member"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {member.email || "No email available"}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/club/members"
            className="rounded-full bg-blue-200 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Back to members
          </Link>
        </div>
      </ClubCard>
    </ClubShell>
  );
}
