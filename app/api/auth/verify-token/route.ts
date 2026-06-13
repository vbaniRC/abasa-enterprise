// 6) Create session (log user in)
const { data: sessionData, error: sessionError } =
  await supabase.auth.admin.createSession({
    user_id: userId,
  });

if (sessionError || !sessionData?.session) {
  return NextResponse.json(
    { error: "Failed to create session" },
    { status: 500 }
  );
}

// 7) Set session cookies
const response = NextResponse.json({ success: true });

response.cookies.set({
  name: "sb-access-token",
  value: sessionData.session.access_token,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
});

response.cookies.set({
  name: "sb-refresh-token",
  value: sessionData.session.refresh_token,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
});

return response;
