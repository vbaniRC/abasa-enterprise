"use client";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 bg-[url('https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png')]"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* TOP RIGHT NAV */}
      <nav className="absolute top-6 right-6 flex gap-6 text-white text-sm font-light tracking-wide z-20">
        <a
          href="/auth/login"
          className="hover:text-gray-300 transition"
        >
          Sign in
        </a>
        <a
          href="/auth/register"
          className="hover:text-gray-300 transition"
        >
          Register
        </a>
      </nav>

      {/* HERO CONTENT */}
      <section className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
          Build. Automate. Scale.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow">
          ABASA is your blueprint for modular club management, automation and operational clarity.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/auth/register"
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Get Started
          </a>

          <a
            href="/auth/login"
            className="px-6 py-3 border border-white/40 text-white rounded-lg hover:bg-white/10 transition"
          >
            Explore Dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
