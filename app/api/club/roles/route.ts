import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // TEMP: nema auth-a dok ne vratiš middleware
  const roles = [
    "superadmin",
    "owner",
    "admin",
    "coach",
    "parent",
    "member",
  ];

  return NextResponse.json(
    {
      message: "Roles fetched successfully",
      roles,
    },
    { status: 200 }
  );
}
