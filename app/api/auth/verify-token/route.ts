import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1) Find user
    const { data: userData, error: userError } = await supabase
      .from("auth_users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userData.id;

    // 2) Find verification code
    const { data: codeData, error: codeError } = await supabase
      .from("email_verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("code", code)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (codeError || !codeData) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // 3) Check expiration
    const now = new Date();
    const expires = new Date(codeData.expires_at);

    if (expires < now) {
      return NextResponse.json(
        { error: "Verification code expired" },
        { status: 400 }
      );
    }

    // 4) Mark user as verified
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to verify user" },
        { status: 500 }
      );
    }

    // 5) Delete used code
    await supabase
      .from("email_verification_codes")
      .delete()
      .eq("id", codeData.id);

    // 6) Create JWT for instant login
    const { data: jwtData, error: jwtError } =
      await supabase.auth.admin.createJwt({
        user_id: userId,
      });

    if (jwtError || !jwtData?.token) {
      return NextResponse.json(
        { error: "Failed to generate login token" },
        { status: 500 }
      );
    }

    // 7) Return token to frontend
    return NextResponse.json({
      success: true,
      token: jwtData.token,
    });

  } catch (err: any) {
    console.error("Verify API error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
