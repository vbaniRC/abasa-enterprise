import { NextResponse } from "next/server";


export async function GET(req: Request) {
  // AUTH → bilo koji logirani user može vidjeti role
  

  return NextResponse.json({
    message: "Roles fetched successfully",
    roles,
  });
}
