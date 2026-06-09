import { cookies } from "next/headers";

export async function auth() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized: No session cookie found",
      user: null,
    };
  }

  try {
    const user = JSON.parse(session.value);

    if (!user || !user.id) {
      return {
        ok: false,
        status: 401,
        message: "Unauthorized: Invalid session",
        user: null,
      };
    }

    return {
      ok: true,
      status: 200,
      user,
    };
  } catch (err) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized: Session parse error",
      user: null,
    };
  }
}
