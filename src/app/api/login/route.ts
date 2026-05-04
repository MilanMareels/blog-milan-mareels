import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const token = await createToken();

    // Zet de HTTP-Only Cookie
    (
      await // Zet de HTTP-Only Cookie
      cookies()
    ).set("admin_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 2, // 2 uur
      path: "/",
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Onjuist wachtwoord" }, { status: 401 });
}
