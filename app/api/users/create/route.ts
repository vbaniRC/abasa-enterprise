import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // Insert user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password,
        role,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, user: data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
