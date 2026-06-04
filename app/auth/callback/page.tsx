// (GITHUB-PUTANJA-FILE: /abasa-sport/app/auth/callback/page.tsx)

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      // Supabase automatski hvata OAuth token iz URL-a
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("OAuth callback error:", error);
        router.push("/login");
        return;
      }

      if (!data?.session) {
        // Ako nema sessiona → nešto nije u redu
        router.push("/login");
        return;
      }

      // Ako je sve ok → redirect na dashboard
      router.push("/dashboard");
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center opacity-70">
        Signing you in...
      </div>
    </div>
  );
}
