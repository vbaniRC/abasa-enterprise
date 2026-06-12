"use client";

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png')",
      }}
    >
      <section className="relative z-20 flex flex-col items-center justify-center text-center min-h-screen px-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          ABASA
        </h1>
        <p className="mt-4 text-lg text-white opacity-90 drop-shadow">
          Welcome to the enterprise platform.
        </p>
      </section>

      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
    </main>
  );
}
