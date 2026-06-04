import { NextResponse } from "next/server";

export async function requireAuth(req: any, res: typeof NextResponse) {
  return true;
}
