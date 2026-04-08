import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ADMIN_COOKIE_NAME = "admin_session";
const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET env var");
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload extends JWTPayload {
  role: "admin";
  username: string;
}

export async function createAdminSessionToken(payload: AdminSessionPayload) {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DEFAULT_EXPIRES_IN_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || typeof payload.username !== "string") {
      return null;
    }
    return {
      role: payload.role as "admin",
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}
