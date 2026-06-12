"use client";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full">

      {/* TEST: CRVENI KVADRAT */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-red-500 z-50"></div>

      {/* BACKGROUND TEST */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-transparent z-10" />

      {/* HERO CONTENT */}
      <section className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
          Test
        </h1>
      </section>
    </main>
  );
}
