"use client";

import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative px-4">

      {/* HEADER */}
      <header className="absolute top-0 left-0 px-8 py-6 z-30">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg">ABASA</h1>
        <p className="text-sm text-white opacity-90 drop-shadow">
          Welcome to the enterprise platform.
        </p>
      </header>

      {/* CARD */}
      <div
        className="
          fade-in
          w-full max-w-[360px]
          rounded-[36px]
          p-10
          border border-[#141414]
          bg-gradient-to-b from-white/5 to-white/[0.02]
          backdrop-blur-xl
          shadow-[0_0_55px_-12px_rgba(0,0,0,0.85)]
          relative
          z-20
          text-center
        "
      >
        <h1 className="text-lg font-semibold mb-6 text-white tracking-tight">
          Check your email
        </h1>

        <p className="text-neutral-300 text-[15px] leading-relaxed">
          We’ve sent a verification link to
          <br />
          <span className="text-white font-medium">
            {email || "your email address"}
          </span>
        </p>

        <p className="text-neutral-400 text-sm mt-6 leading-relaxed">
          Please open the message and click the link to continue.
          <br />
          The link expires shortly and can only be used once.
        </p>

        <p className="text-neutral-500 text-xs mt-10">
          Didn’t receive the email?  
          <br />
          Check your spam folder or try again later.
        </p>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-6 flex items-center gap-2 opacity-80 z-20">
        <span className="text-[10px] text-white tracking-wide opacity-80">
          Powered by Copilot
        </span>
      </div>

    </div>
  );
}
