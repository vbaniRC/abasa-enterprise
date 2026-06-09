import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ADMIN KLIJENT — mora koristiti SUPABASE_URL (NE NEXT_PUBLIC!)
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL!,               // FIX #1
      process.env.SUPABASE_SERVICE_ROLE_KEY!   // service role
    );

    // 1) Kreiraj usera u Supabase Auth
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      });

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: userError?.message || "Failed to create user" },
        { status: 400 }
      );
    }

    const user = userData.user;

    // 2) Generiraj 6‑znamenkasti kod
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3) Spremi kod u DB
    const { error: insertError } = await supabaseAdmin
      .from("email_verification_codes")
      .insert({
        user_id: user.id,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to store verification code" },
        { status: 500 }
      );
    }

    // 4) Pozovi Edge Function za slanje emaila
    const sendEmailRes = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/send-verification-email`, // FIX #2
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, // ispravno
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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
