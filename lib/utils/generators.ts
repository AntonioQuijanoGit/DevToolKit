import { v1 as uuidv1, v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

export function generateUUIDs(version: "1" | "4", count: number): string[] {
  const generator = version === "1" ? uuidv1 : uuidv4;
  return Array.from({ length: count }, () => generator());
}

export function generateHash(
  text: string,
  algorithm: "MD5" | "SHA-1" | "SHA-256" | "SHA-512"
): string {
  switch (algorithm) {
    case "MD5":
      return CryptoJS.MD5(text).toString();
    case "SHA-1":
      return CryptoJS.SHA1(text).toString();
    case "SHA-256":
      return CryptoJS.SHA256(text).toString();
    case "SHA-512":
      return CryptoJS.SHA512(text).toString();
    default:
      throw new Error("Unknown algorithm");
  }
}

export function decodeJWT(token: string): {
  header: object;
  payload: object;
  signature: string;
  expired?: boolean;
} {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const [headerB64, payloadB64, signature] = parts;

    const header = JSON.parse(atob(headerB64));
    const payload = JSON.parse(atob(payloadB64));

    // Check if token is expired
    let expired = false;
    if (payload.exp) {
      expired = Date.now() >= payload.exp * 1000;
    }

    return {
      header,
      payload,
      signature,
      expired,
    };
  } catch (error) {
    throw new Error(
      `Failed to decode JWT: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}



