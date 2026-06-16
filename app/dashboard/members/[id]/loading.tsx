import { MembersCard, MembersShell } from "../_components/member-ui";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

export default function MemberDetailLoading() {
  return (
    <MembersShell
      title="Member detail"
      description="Loading member details for your authenticated club."
      backHref="/dashboard/members"
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <MembersCard>
          <div className="space-y-5">
            <SkeletonBlock className="h-16 w-16" />
            <SkeletonBlock className="h-8 w-56" />
            <SkeletonBlock className="h-6 w-28" />
            <SkeletonBlock className="h-24 w-full" />
          </div>
        </MembersCard>
        <MembersCard>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-20 w-full" />
            ))}
          </div>
        </MembersCard>
      </section>
    </MembersShell>
  );
}
