import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Supabase admin client (service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1) Create or fetch user
    const { data: existingUser } = await supabase
      .from("auth_users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user in Supabase Auth
      const { data: userData, error: userError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: false,
        });

      if (userError || !userData?.user) {
        return NextResponse.json(
          { error: userError?.message || "Failed to create user" },
          { status: 400 }
        );
      }

      userId = userData.user.id;
    }

    // 2) Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3) Save code to DB
    const { error: insertError } = await supabase
      .from("email_verification_codes")
      .insert({
        user_id: userId,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to store verification code" },
        { status: 500 }
      );
    }

    // 4) Send email via Edge Function
    const sendEmailRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
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
    console.error("Register API error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
