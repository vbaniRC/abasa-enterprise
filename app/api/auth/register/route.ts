import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // 1) ADMIN KLIJENT — koristi SERVICE ROLE KEY
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2) Kreiraj usera
    const { data: user, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    // 3) Generiraj 6‑znamenkasti kod
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4) Pozovi Edge Function — koristi ANON KEY
    const sendEmailRes = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/send-verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, code }),
      }
    );

    if (!sendEmailRes.ok) {
      const err = await sendEmailRes.text();
      return NextResponse.json(
        { error: "Failed to send verification email", details: err },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, userId: user.user.id },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
