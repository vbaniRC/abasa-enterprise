"use client";

import { useEffect, useState } from "react";

export default function LandingPage() {
  const images = [
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page_SR.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_tenis.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/landing_page_mob.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_3.png",
    "https://grvomwpejsgokxcandkr.supabase.co/storage/v1/object/public/public-assets/Landing_page_4.png",
  ];

  const texts = [
    "REVOLUTION IN MEMBERSHIP ADMINISTRATION",
    "Digitalize your sports, social or any membership organization.",
    "Manage memberships, coaches, and training sessions.",
    "Get in contact with your members.",
    "Manage payments, credit cards, total automation.",
    "ABASA — your club, your rules.",
  ];

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // PRELOAD all images
  useEffect(() => {
    const preload = images.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    Promise.all(
      preload.map(
        (img) =>
          new Promise((resolve) => {
            img.onload = resolve;
          })
      )
    ).then(() => setLoaded(true));
  }, []);

  // ROTATION
  useEffect(() => {
    if (!loaded) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [loaded]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">

      {/* Single rotating background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms]"
        style={{
          backgroundImage: `url('${images[index]}')`,
          opacity: loaded ? 1 : 0,
        }}
      />

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        {texts.map((text, i) => (
          <p
            key={i}
            className={`absolute bottom-[150px] left-1/2 -translate-x-1/2 
              text-white text-[2.2rem] font-semibold drop-shadow-lg 
              max-w-3xl text-center transition-opacity duration-[2000ms] ease-in-out 
              ${i === index ? "opacity-100" : "opacity-0"}`}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
    </main>
  );
}
