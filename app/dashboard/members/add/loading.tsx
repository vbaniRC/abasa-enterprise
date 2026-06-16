import { MembersCard, MembersShell } from "../_components/member-ui";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

export default function AddMemberLoading() {
  return (
    <MembersShell
      title="Add member"
      description="Loading the member creation form."
      backHref="/dashboard/members"
    >
      <MembersCard>
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-20 w-full" />
          ))}
        </div>
        <SkeletonBlock className="mt-6 h-12 w-40" />
      </MembersCard>
    </MembersShell>
  );
}
