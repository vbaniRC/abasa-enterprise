import { NextResponse } from "next/server";

export async function requireRole(req: any, res: typeof NextResponse) {
  return true;
}
