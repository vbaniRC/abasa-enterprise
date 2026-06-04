"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      }
    };

    handleSession();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
        <h1 className="text-2xl font-bold mb-4">Confirming your account...</h1>
        <p className="text-gray-600">Please wait a moment.</p>
      </div>
    </div>
  );
}
