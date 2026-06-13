"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkVerification() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Ako je user već verificiran → šaljemo ga dalje
      if (user && user.email_confirmed_at) {
        router.push("/dashboard"); // promijeni ako želiš
        return;
      }

      setLoading(false);
    }

    checkVerification();
  }, [supabase, router]);

  async function resendEmail() {
    setError("");
    setResent(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No user session found.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email!,
      options: {
        emailRedirectTo: `${location.origin}/auth/verify`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setResent(false);
    setTimeout(() => setResent(true), 10);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl p-8 space-y-6 shadow-xl text-center">

        <h1 className="text-2xl font-semibold text-white">Verify your email</h1>

        {loading ? (
          <p className="text-gray-400">Checking verification status…</p>
        ) : (
          <>
            <p className="text-gray-300">
              We’ve sent a verification link to your email.
            </p>

            <p className="text-gray-500 text-sm">
              Click the link in the email to activate your account.
            </p>

            {error && <p className="text-red-500 text-sm shake">{error}</p>}

            {resent && (
              <p className="text-green-500 text-sm email-sent">
                Verification email sent.
              </p>
            )}

            <button
              onClick={resendEmail}
              className="w-full bg-white/10 border border-white/10 text-white py-2 rounded-md text-sm hover:bg-white/20 transition"
            >
              Resend verification email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
