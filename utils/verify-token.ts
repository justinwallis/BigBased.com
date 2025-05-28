import { authenticator } from "otplib"

/**
 * Verifies a TOTP token against a secret
 *
 * @param secret The authenticator secret
 * @param token The token to verify
 * @returns boolean indicating if the token is valid
 */
export function verifyToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({
      token,
      secret,
      window: 2, // Allow 2 time steps before/after for clock drift
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    return false
  }
}
