"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("Missing email parameter.");
    }
  }, [email]);

  async function submitCode() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid code");
      setLoading(false);
      return;
    }

    // success → redirect
    router.push("/dashboard");
  }

  async function resendCode() {
    setError("");
    setResent(false);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to resend code");
      return;
    }

    setTimeout(() => setResent(true), 50);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl p-8 space-y-6 shadow-xl text-center">

        <h1 className="text-2xl font-semibold text-white">Verify your email</h1>

        <p className="text-gray-300">
          Enter the 6‑digit code we sent to:
        </p>

        <p className="text-white font-medium">{email}</p>

        {/* Error */}
        {error && <p className="text-red-500 text-sm shake">{error}</p>}

        {/* Resent animation */}
        {resent && (
          <p className="text-green-500 text-sm email-sent">
            New code sent.
          </p>
        )}

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-black/20 border border-white/10 text-white text-center py-3 rounded-md tracking-widest text-xl outline-none"
          placeholder="______"
        />

        <button
          onClick={submitCode}
          disabled={loading}
          className="w-full bg-white/10 border border-white/10 text-white py-2 rounded-md text-sm hover:bg-white/20 transition disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        <button
          onClick={resendCode}
          className="w-full text-gray-400 text-sm hover:text-white transition"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
