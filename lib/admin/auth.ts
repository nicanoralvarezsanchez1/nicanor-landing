/**
 * Panel /admin: una sola contraseña compartida (ADMIN_PASSWORD), igual que
 * Sinapsis. La cookie httpOnly guarda el hash de la contraseña vigente y la
 * revisa middleware.ts; si la contraseña cambia, las sesiones viejas caducan.
 * Usa Web Crypto porque middleware.ts corre en el Edge Runtime.
 */

export const ADMIN_SESSION_COOKIE = "nicanor_admin_session";

async function sha256Hex(texto: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function buildAdminSessionToken(): Promise<string> {
  return sha256Hex(`nicanor:${process.env.ADMIN_PASSWORD ?? ""}`);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === (await buildAdminSessionToken());
}
