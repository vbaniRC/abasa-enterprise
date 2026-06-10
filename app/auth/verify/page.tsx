"use client";
export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
      const isValid = false;

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
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-[150px]">

      {/* ABASA */}
      <div className="text-4xl font-bold tracking-wide mb-[10px]">
        ABASA
      </div>

      {/* Description under ABASA */}
      <div className="text-center text-white/70 text-[0.9rem] mb-[30px] max-w-[320px] leading-relaxed">
        We’ve sent an email to <span className="text-white font-medium">{email}</span> containing your verification code.  
        Please check your inbox and enter the code below.
      </div>

      {/* CARD */}
      <div
        className={`
          rounded-[20px] p-8
          shadow-[0_0_40px_rgba(255,255,255,0.08)]
          backdrop-blur-xl
          bg-[rgba(20,20,20,0.55)]
          transition-all duration-300
          animate-fade-in
          ${error ? "animate-shake" : ""}
          ${success ? "shadow-[0_0_40px_rgba(0,255,120,0.5)]" : ""}
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

        {/* VERIFY BUTTON */}
        <button
          className="
            w-1/2 py-[13px]
            bg-white text-black
            rounded-xl font-semibold
            hover:bg-gray-200 transition
            flex items-center justify-center
            mb-[20px]
            mx-auto
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

        {/* RESEND */}
        <div className="flex justify-center text-sm text-white/70 mb-[200px]">
          {timer > 0 ? (
            <div className="w-1/2 text-center">
              Resend code in {timer}s
            </div>
          ) : (
            <button
              onClick={resendCode}
              className="w-1/2 text-center underline hover:text-gray-300 transition"
            >
              Resend code
            </button>
          )}
        </div>

        {/* POWERED BY COPILOT */}
        <div className="text-center text-xs text-white/40" style={{ fontSize: "80%" }}>
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
