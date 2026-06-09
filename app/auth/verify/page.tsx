"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const email = "user@example.com"; // OVDJE ubaciš stvarni email iz registra

  const handleChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0A] px-4">

      <div
        className="
        w-full max-w-[360px]
        rounded-[36px]
        p-10
        border border-[#141414]
        bg-gradient-to-b from-white/5 to-white/[0.02]
        backdrop-blur-xl
        shadow-[0_0_55px_-12px_rgba(0,0,0,0.85)]
        relative
      "
      >

        {/* ABASA */}
        <div className="absolute top-6 right-6 text-white/70 text-xs font-medium tracking-wide">
          ABASA
        </div>

        {/* Title */}
        <h1 className="text-lg font-semibold mb-4 text-center text-white tracking-tight">
          Verify your email
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-neutral-400 text-center mb-10 leading-relaxed">
          Poslali smo vam verifikacijski kod na:<br />
          <span className="text-white font-medium">{email}</span>
        </p>

        {/* Verification code input */}
        <div className="w-[calc(50%+50px)] mx-auto">
          <input
            type="text"
            value={code}
            onChange={handleChange}
            placeholder="••••••"
            className="
              w-full h-[48px] text-center text-xl tracking-[10px]
              bg-black text-white
              border border-white/20
              rounded-[14px]
              focus:outline-none focus:ring-2 focus:ring-white/40
              placeholder-white/20
            "
          />
        </div>

        {/* Verify button */}
<button
  className="
    w-[calc(50%+50px)] h-[48px] mt-[50px]
    rounded-[14px] text-[15px] font-medium
    bg-white text-black
    border border-white/20
    hover:border-white hover:border-[3px]
    hover:bg-neutral-200
    transition
    flex items-center justify-center
    mx-auto
  "
>
  Verify Email
</button>


        {/* Resend */}
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Niste dobili kod?{" "}
          <span className="text-neutral-300 font-medium hover:underline cursor-pointer">
            Pošalji ponovo
          </span>
        </p>
      </div>

      {/* Powered by Copilot */}
      <div className="mt-6 flex items-center gap-2 opacity-80">
        <span className="text-[10px] text-white tracking-wide opacity-80">
          Powered by Copilot
        </span>
      </div>

    </div>
  );
}
