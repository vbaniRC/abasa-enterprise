import { notFound } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { updateMember } from "@/app/dashboard/members/actions";
import {
  MembersCard,
  MembersShell,
} from "@/app/dashboard/members/_components/member-ui";
import { getMemberById } from "@/app/dashboard/members/_lib/actions";
import { MemberForm } from "@/components/member/MemberForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: { id: string };
};

export default async function EditMemberPage({ params }: PageProps) {
  const member = await getMemberById(params.id);

  if (!member) {
    notFound();
  }

  const updateMemberAction = updateMember.bind(null, member.id);

  return (
    <MembersShell
      title={`Edit ${member.first_name} ${member.last_name}`}
      description="Update member details inside your authenticated club."
      backHref={`/dashboard/members/${member.id}`}
      action={
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-blue-100">
          <PencilSquareIcon className="h-7 w-7" />
        </div>
      }
    >
      <MembersCard
        title="Member details"
        description="Only allowed member fields are updated, and the member ID is checked against your club."
      >
        <MemberForm
          mode="edit"
          initialData={member}
          onSubmit={updateMemberAction}
        />
      </MembersCard>
    </MembersShell>
  );
}
