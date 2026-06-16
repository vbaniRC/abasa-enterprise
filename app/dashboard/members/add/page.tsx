import { UserPlusIcon } from "@heroicons/react/24/outline";

import { createMember } from "@/app/dashboard/members/actions";
import {
  MembersCard,
  MembersShell,
} from "@/app/dashboard/members/_components/member-ui";
import { requireMembersUser } from "@/app/dashboard/members/_lib/server";
import { MemberForm } from "@/components/member/MemberForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AddMemberPage() {
  await requireMembersUser();

  return (
    <MembersShell
      title="Add member"
      description="Create a member inside your authenticated club."
      backHref="/dashboard/members"
      action={
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-blue-100">
          <UserPlusIcon className="h-7 w-7" />
        </div>
      }
    >
      <MembersCard
        title="Member details"
        description="Required fields are validated before the server action creates the member."
      >
        <MemberForm mode="create" onSubmit={createMember} />
      </MembersCard>
    </MembersShell>
  );
}
