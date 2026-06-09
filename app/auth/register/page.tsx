"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

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
                w-full h-[24px] px-3 text-sm
                bg-black text-white
                border-none
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white/40
                placeholder-gray-400
              "
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
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
              ${confirm.length > 0 && !passwordsMatch ? "border
