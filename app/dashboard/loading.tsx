function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/10 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur">
          <div className="p-6 sm:p-8 lg:p-10">
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="mt-4 h-12 w-full max-w-2xl" />
            <SkeletonBlock className="mt-4 h-6 w-full max-w-xl" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <SkeletonBlock className="h-28 w-28" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-9 w-72" />
              <SkeletonBlock className="h-5 w-56" />
            </div>
          </div>
        </section>

        <section
          aria-label="Loading dashboard statistics"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20"
            >
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="mt-5 h-10 w-20" />
              <SkeletonBlock className="mt-4 h-4 w-44" />
            </article>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
            <SkeletonBlock className="h-8 w-56" />
            <div className="mt-8 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-20 w-full" />
              ))}
            </div>
          </section>
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/20 sm:p-8">
            <SkeletonBlock className="h-8 w-48" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-24 w-full" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
