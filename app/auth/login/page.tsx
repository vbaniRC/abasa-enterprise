"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard/dashboard");
  }

  async function handleForgotPassword() {
    setError("");
    setResetSent(false);

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setResetSent(true);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl p-8 space-y-6 shadow-xl">

        <h1 className="text-2xl font-semibold text-white">Log in</h1>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              id="email"
              name="email"
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
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Your password"
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
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm shake">{error}</p>
          )}

          {/* Reset email sent */}
          {resetSent && (
            <p className="text-green-500 text-sm email-sent">
              Password reset email sent.
            </p>
          )}

          {/* Continue */}
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            Log in
          </button>

          {/* Forgot password */}
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-gray-400 text-sm hover:text-white transition underline-offset-2 hover:underline"
          >
            Forgot password
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
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-white hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
