"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const images = [
    "/landing/1.jpg",
    "/landing/2.jpg",
    "/landing/3.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // mijenja sliku svakih 6 sekundi

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Fade-out / Fade-in rotacija */}
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Tamni overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          A‑BASA — Sportska platforma nove generacije
        </h1>

        <p className="text-lg md:text-2xl mb-10 max-w-2xl drop-shadow-lg">
          Jednostavno upravljanje klubovima, članovima, treninzima i natjecanjima.
        </p>

        <div className="flex gap-4">
          <a
            href="/auth/login"
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            Prijava
          </a>

          <a
            href="/auth/register"
            className="px-6 py-3 bg-transparent border border-white font-semibold rounded-lg shadow-lg hover:bg-white hover:text-black transition"
          >
            Registracija
          </a>
        </div>
      </div>
    </div>
  );
}
