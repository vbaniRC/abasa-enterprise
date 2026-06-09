"use client";

import { useEffect, useRef, useState } from "react";

export default function VerifyPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const email = "user@example.com"; // OVDJE ubaciš stvarni email

  // Resend timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-submit when all digits filled
  useEffect(() => {
    if (digits.every((d) => d !== "")) {
      handleVerify();
    }
  }, [digits]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && digits[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      const code = digits.join("");

      if (code !== "123456") {
        setError("Krivi verifikacijski kod");
        setLoading(false);
        return;
      }

      // uspješna verifikacija
      console.log("Verified!");
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setDigits(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
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

       <div className="flex justify-center gap-3">
  {digits.map((digit, index) => (
    <input
      key={index}
      ref={(el) => (inputsRef.current[index] = el)}
      type="text"
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      className={`
        w-[42px] h-[60px] text-center text-[26px]
        bg-black text-white
        border rounded-[16px]
        focus:outline-none focus:ring-2 focus:ring-white/40
        ${error ? "border-red-500" : "border-white/20"}
      `}
    />
  ))}
</div>


        {/* Error message */}
        {error && (
          <p className="text-red-500 text-xs text-center mt-3">
            {error}
          </p>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading}
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
            disabled:opacity-50
          "
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify Email"
          )}
        </button>

        {/* Resend */}
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Niste dobili kod?{" "}
          <span
            onClick={handleResend}
            className={`font-medium cursor-pointer ${
              resendTimer > 0
                ? "text-neutral-600"
                : "text-neutral-300 hover:underline"
            }`}
          >
            {resendTimer > 0
              ? `Pošalji ponovo za ${resendTimer}s`
              : "Pošalji ponovo"}
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
