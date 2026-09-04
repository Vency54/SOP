import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { gerarTokenCSRF } from "@/lib/csrf";

export async function GET() {
  const token = gerarTokenCSRF();

  const cookieStore = await cookies();

  cookieStore.set("csrfToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    csrfToken: token,
  });
}
