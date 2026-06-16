import { MembersCard, MembersShell } from "./_components/member-ui";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

export default function MembersLoading() {
  return (
    <MembersShell
      title="Members"
      description="Loading members assigned to your authenticated club."
    >
      <MembersCard>
        <div className="space-y-4">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-10 w-72" />
        </div>
      </MembersCard>
      <MembersCard>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-16 w-full" />
          ))}
        </div>
      </MembersCard>
    </MembersShell>
  );
}
