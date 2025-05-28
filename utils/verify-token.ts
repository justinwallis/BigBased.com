import { authenticator } from "otplib"

// Configure otplib to avoid deprecation warnings
authenticator.options = {
  window: 2, // Allow 2 time steps before/after for clock drift
}

export function verifyToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({
      token: token.replace(/\s/g, ""), // Remove any whitespace
      secret: secret,
      window: 2,
    })
  } catch (error) {
    console.error("Error verifying token:", error)
    return false
  }
}

export function generateSecret(): string {
  return authenticator.generateSecret()
}

export function generateQRCodeURL(secret: string, email: string, issuer = "Big Based"): string {
  return authenticator.keyuri(email, issuer, secret)
}
