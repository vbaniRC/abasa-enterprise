"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const code = digits.join("");

    if (code.length !== 6) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1200);
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (timer > 0) return;

    setTimer(60);

    await fetch("/api/auth/resend-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-2">Verify your email</h1>
      <p className="text-white/60 mb-6">{email}</p>

      <div className={`flex mb-6 ${shake ? "animate-shake" : ""}`}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el: HTMLInputElement | null) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="
              w-[47px]
              h-[55px]
              mx-[3px]
              text-center
              text-[26px]
              bg-black
              text-white
              border border-white/20
              rounded-[14px]
              focus:outline-none
              focus:ring-2
              focus:ring-white/40
            "
          />
        ))}
      </div>

      <button
        onClick={verifyCode}
        disabled={loading}
        className="
          w-full
          max-w-[260px]
          py-3
          rounded-xl
          bg-white
          text-black
          font-semibold
          mb-3
          disabled:opacity-50
        "
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        onClick={resendCode}
        disabled={timer > 0}
        className="text-white/60 text-sm"
      >
        {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
      </button>

      {success && (
        <p className="mt-4 text-green-400 text-sm">Success! Redirecting…</p>
      )}
    </div>
  );
}
