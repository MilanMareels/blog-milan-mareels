import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({ authenticated: true });
}
