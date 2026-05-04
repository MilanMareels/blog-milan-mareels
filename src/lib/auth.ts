import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "fallback-secret-niet-gebruiken-in-productie";
const key = new TextEncoder().encode(secretKey);

export async function createToken() {
  return await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("2h").sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}
