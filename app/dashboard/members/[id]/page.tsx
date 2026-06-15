import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDaysIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { DeleteMemberButton } from "@/app/dashboard/members/_components/DeleteMemberButton";
import {
  MembersCard,
  MembersShell,
  StatusBadge,
} from "@/app/dashboard/members/_components/member-ui";
import { getMemberById } from "@/app/dashboard/members/_lib/actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

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

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-white">{value || "-"}</p>
    </div>
  );
}

export default async function MemberDetailPage({ params }: PageProps) {
  const member = await getMemberById(params.id);

  if (!member) {
    notFound();
  }

  const fullName = `${member.first_name} ${member.last_name}`;

  return (
    <MembersShell
      title={fullName}
      description="Review member profile details for the authenticated club."
      backHref="/dashboard/members"
      action={
        <Link
          href={`/dashboard/members/${member.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
        >
          <PencilSquareIcon className="h-5 w-5" />
          Edit member
        </Link>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <MembersCard>
          <div className="flex flex-col items-start gap-5 rounded-3xl border border-white/10 bg-slate-950/40 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-300/10">
              <UserCircleIcon className="h-10 w-10 text-blue-100" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
              <div className="mt-4">
                <StatusBadge status={member.status} />
              </div>
            </div>
            <div className="grid w-full gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-200" />
                <span>{member.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-blue-200" />
                <span>{member.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDaysIcon className="h-5 w-5 text-blue-200" />
                <span>{formatDate(member.date_of_birth)}</span>
              </div>
            </div>
          </div>
        </MembersCard>

        <MembersCard
          title="Member information"
          description="Data is scoped by member ID and the authenticated user's club."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="First name" value={member.first_name} />
            <DetailItem label="Last name" value={member.last_name} />
            <DetailItem label="Email" value={member.email} />
            <DetailItem label="Phone" value={member.phone} />
            <DetailItem
              label="Birthdate"
              value={formatDate(member.date_of_birth)}
            />
            <DetailItem label="Status" value={member.status} />
            <DetailItem
              label="Created at"
              value={formatDate(member.created_at)}
            />
            <DetailItem
              label="Updated at"
              value="Not tracked in the current Supabase members schema"
            />
          </div>
        </MembersCard>
      </section>

      <MembersCard
        title="Danger zone"
        description="Deleting a member is protected by the same club ownership check used for reads."
      >
        <DeleteMemberButton memberId={member.id} />
      </MembersCard>
    </MembersShell>
  );
}
