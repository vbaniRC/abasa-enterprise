"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 3;
    return 2;
  })();

  const passwordsMatch = confirm.length > 0 && password === confirm;

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

        {/* ABASA - gornji desni kut */}
        <div className="absolute top-6 right-6 text-white/70 text-xs font-medium tracking-wide">
          ABASA
        </div>

        {/* Create account */}
        <h1 className="text-lg font-semibold mb-10 text-center text-white tracking-tight">
          Create an account
        </h1>

        <div className="flex flex-col items-center gap-[15px]">

          {/* Email input */}
          <div className="w-[calc(50%+50px)] bg-black rounded-lg border border-white/20">
            <input
              type="email"
              placeholder="Email Address"
              className="
                w-full h-[24px] px-3 text-sm
                bg-black text-white
                border-none
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white/40
                placeholder-gray-400
              "
            />
          </div>

          {/* Password input */}
          <div className="w-[calc(50%+50px)] bg-black rounded-lg border border-white/20 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full h-[24px] px-3 pr-10 text-sm
                bg-black text-white
                border-none
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white/40
                placeholder-gray-400
              "
            />

            {/* Eye icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </span>
          </div>

          {/* Password strength meter */}
          {password.length > 0 && (
            <div className="w-[calc(50%+50px)] flex gap-1">
              <div className={`h-1 flex-1 rounded ${passwordStrength >= 1 ? "bg-red-500" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 rounded ${passwordStrength >= 2 ? "bg-yellow-500" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 rounded ${passwordStrength >= 3 ? "bg-green-500" : "bg-white/10"}`} />
            </div>
          )}

          {/* Confirm Password input */}
          <div
            className={`
              w-[calc(50%+50px)] bg-black rounded-lg border
              ${confirm.length > 0 && !passwordsMatch ? "border-red-500" : "border-white/20"}
            `}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="
                w-full h-[24px] px-3 pr-10 text-sm
                bg-black text-white
                border-none
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white/40
                placeholder-gray-400
              "
            />
          </div>

          {/* Password mismatch message */}
          {confirm.length > 0 && !passwordsMatch && (
            <p className="text-red-500 text-xs w-[calc(50%+50px)] text-left">
              Passwords do not match
            </p>
          )}

          {/* Continue with Email */}
          <button
            className="
            w-[calc(50%+50px)] h-[48px]
            rounded-[14px] text-[15px] font-medium
            bg-white text-black
            border border-white/20
            hover:border-white hover:border-[3px]
            hover:bg-neutral-200
            transition
            flex items-center justify-center
            mb-[25px]
          "
          >
            Continue with Email
          </button>

          {/* Google */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-[rgb(145,145,145)] text-black
              border border-transparent
              hover:bg-[rgb(220,220,220)]
              hover:border-white hover:border-[3px]
              transition
              flex items-center justify-center gap-2
            "
          >
            <FcGoogle size={18} />
            <span>Continue with Google</span>
          </button>

          {/* Apple */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-[rgb(145,145,145)] text-black
              border border-transparent
              hover:bg-[rgb(220,220,220)]
              hover:border-white hover:border-[3px]
              transition
              flex items-center justify-center gap-2
            "
          >
            <FaApple size={18} className="text-black" />
            <span>Continue with Apple</span>
          </button>

          {/* Passkey */}
          <button
            className="
              w-[calc(50%+50px)] h-[48px]
              rounded-[14px] text-[15px] font-medium
              bg-[rgb(145,145,145)] text-black
              border border-transparent
              hover:bg-[rgb(220,220,220)]
              hover:border-white hover:border-[3px]
              transition
              flex items-center justify-center
            "
          >
            <span>Continue with Passkey</span>
          </button>

        </div>

        {/* Sign In */}
        <p className="text-sm text-neutral-500 mt-[100px] text-center">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-neutral-400 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>

      {/* Powered by Copilot */}
      <div className="mt-6 flex items-center gap-2 opacity-80">
        <span className="text-[10px] text-white tracking-wide opacity-80">
          Powered by ABASA and Copilot
        </span>
      </div>

    </div>
  );
}
