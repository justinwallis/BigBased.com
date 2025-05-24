// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  // Check minimum length
  if (password.length < 10) {
    return { valid: false, message: "Password must be at least 10 characters long" }
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" }
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }

  // Check for special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" }
  }

  return { valid: true }
}
