import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, buildAdminSessionToken, verifyAdminPassword } from "@/lib/admin/auth";

const DOCE_HORAS = 60 * 60 * 12;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await buildAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DOCE_HORAS,
  });
  return response;
}
