"use client";

import { useEffect, useState } from "react";

export default function LandingPage() {
  const images = [
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_tenis.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_3.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_4.png",
  ];

  const texts = [
    "Club administration has never been easier.",
    "Digitalize your sports organization.",
    "Manage memberships, coaches, and training sessions.",
    "ABASA — your club, your rules.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">

      {/* Rotating background images */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* Fixed-position rotating text */}
      <div className="absolute inset-0 flex items-center z-30">
        {texts.map((text, i) => (
          <p
            key={i}
            className={`absolute left-[10px] text-white text-[2.25rem] font-semibold drop-shadow-lg max-w-3xl text-left transition-opacity duration-[2000ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {text}
          </p>
        ))}
      </div>

      {/* Top bar */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-30">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">ABASA</h1>
          <p className="text-sm text-white opacity-90 drop-shadow">
            Welcome to the Club administration platform.
          </p>
        </div>

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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
    </main>
  );
}
