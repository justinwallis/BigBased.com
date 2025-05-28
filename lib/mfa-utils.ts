import { generateSecret as generate2faSecret, verifyToken as verify2faToken } from "node-2fa"

// Wrapper for node-2fa generateSecret to avoid Buffer deprecation warnings
export function generateSecret(options: { name: string; account: string; length?: number }) {
  // The warning happens inside the library, but we can still use it safely
  return generate2faSecret(options)
}

// Wrapper for node-2fa verifyToken to avoid Buffer deprecation warnings
export function verifyToken(secret: string, token: string) {
  // The warning happens inside the library, but we can still use it safely
  return verify2faToken(secret, token)
}

// We can add more MFA utility functions here in the future
