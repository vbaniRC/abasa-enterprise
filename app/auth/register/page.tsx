"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  // ⭐ Password strength util — direktno u komponenti
  function getPasswordStrength(password: string) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score === 0) return { label: "Too weak", color: "bg-red-500", value: 0 };
    if (score === 1) return { label: "Weak", color: "bg-red-500", value: 25 };
    if (score === 2) return { label: "Medium", color: "bg-yellow-500", value: 50 };
    if (score === 3) return { label: "Strong", color: "bg-green-500", value: 75 };
    if (score === 4) return { label: "Very strong", color: "bg-green-600", value: 100 };

    return { label: "Too weak", color: "bg-red-500", value: 0 };
  }

  const strength = getPasswordStrength(password);

  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/verify`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/auth/verify");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl p-8 space-y-6 shadow-xl">

        <h1 className="text-2xl font-semibold text-white">Create ABASA Account</h1>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-200">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Create a password"
              />

              {/* Show/Hide */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-400 hover:text-white"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Caps Lock warning */}
            {capsLock && (
              <p className="text-xs text-yellow-400">Caps Lock is ON</p>
            )}

            {/* Strength bar */}
            <div className="w-full h-1 bg-white/10 rounded-md overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.value}%` }}
              />
            </div>

            {/* Strength label */}
            <p className="text-xs text-gray-400">{strength.label}</p>

            {/* Requirements */}
            <div className="space-y-1 mt-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={req.valid ? "text-green-500" : "text-gray-500"}>
                    {req.valid ? "✔" : "✖"}
                  </span>
                  <span className={req.valid ? "text-green-500" : "text-gray-400"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Repeat your password"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm shake">{error}</p>
          )}

          {/* Continue with Email */}
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            Continue with Email
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full bg-white/10 border border-white/10 text-white py-2 rounded-md text-sm hover:bg-white/20 transition"
          >
            Continue with Google
          </button>

          {/* Apple */}
          <button
            type="button"
            className="w-full bg-white/10 border border-white/10 text-white py-2 rounded-md text-sm hover:bg-white/20 transition"
          >
            Continue with Apple
          </button>

          {/* Passkey */}
          <button
            type="button"
            className="w-full bg-white/10 border border-white/10 text-white py-2 rounded-md text-sm hover:bg-white/20 transition"
          >
            Continue with Passkey
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm">
          Already have an account{" "}
          <a href="/auth/login" className="text-white hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
