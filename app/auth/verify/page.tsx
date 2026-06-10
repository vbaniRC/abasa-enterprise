"use client";

import { useState, useRef, useEffect } from "react";

export default function VerifyPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // TIMER
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

    if (newDigits.join("").length === 6) {
      submitCode(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const submitCode = async (code: string) => {
    setLoading(true);

    setTimeout(() => {
      const isValid = false; // backend placeholder

      if (!isValid) {
        setLoading(false);
        setError(true);
        setTimeout(() => setError(false), 600);
        return;
      }

      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  const resendCode = () => {
    if (timer > 0) return;
    setTimer(30);
    setDigits(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-[100px]">

      {/* ABASA title */}
      <div className="text-4xl font-bold mb-10 tracking-wide">
        ABASA
      </div>

      {/* CARD */}
      <div
        className={`
          rounded-2xl p-8
          border border-white/10
          shadow-[0_0_40px_rgba(255,255,255,0.08)]
          backdrop-blur-xl
          bg-[rgba(20,20,20,0.55)]
          transition-all duration-300
          animate-fade-in
          ${error ? "animate-shake" : ""}
          ${success ? "shadow-[0_0_40px_rgba(0,255,120,0.5)] border-green-400" : ""}
        `}
        style={{
          width: "fit-content",
          paddingLeft: "50px",
          paddingRight: "50px",
        }}
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Enter Verification Code
        </h1>

        <div className="flex justify-center mb-[20px]">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
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
                bg-black/60
                text-white
                border border-white/20
                rounded-[14px]
                transition-all
                duration-150
                focus:outline-none
                focus:ring-2
                focus:ring-white/60
                focus:shadow-[0_0_12px_rgba(255,255,255,0.5)]
              "
            />
          ))}
        </div>

        <button
          className="
            w-full py-3
            bg-white text-black
            rounded-xl font-semibold
            hover:bg-gray-200 transition
            flex items-center justify-center
            mb-[20px]
          "
          onClick={() => submitCode(digits.join(""))}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : success ? (
            <span className="text-green-600 text-xl">✔</span>
          ) : (
            "Verify"
          )}
        </button>

        <div className="text-center text-sm text-white/70 mb-[200px]">
          {timer > 0 ? (
            <span>Resend code in {timer}s</span>
          ) : (
            <button
              onClick={resendCode}
              className="text-white underline hover:text-gray-300 transition"
            >
              Resend code
            </button>
          )}
        </div>

        <div className="text-center text-xs text-white/40">
          Powered by Copilot
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
