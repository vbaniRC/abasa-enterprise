"use client";

import { useEffect, useState } from "react";

export default function LandingPage() {
  const images = [
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_tenis.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page3.png",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // mijenja sliku svakih 6 sekundi

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">

      {/* Rotirajuće pozadinske slike */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* Top bar */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-30">
        {/* Logo + Title */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">ABASA</h1>
          <p className="text-sm text-white opacity-90 drop-shadow">
            Welcome to the enterprise platform.
          </p>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          <a
            href="/auth/login"
            className="text-white text-sm font-medium px-4 py-2 rounded-md border border-white/70 hover:bg-white/10 transition"
          >
            Sign in
          </a>
          <a
            href="/auth/register"
            className="text-white text-sm font-medium px-4 py-2 rounded-md border border-white/70 hover:bg-white/10 transition"
          >
            Register
          </a>
        </div>
      </header>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
    </main>
  );
}
