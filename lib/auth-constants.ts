export const AUTH_EVENTS = {
  LOGIN: "login",
  LOGOUT: "logout",
  REGISTER: "register",
  PASSWORD_RESET: "password_reset",
  PASSWORD_CHANGE: "password_change",
  EMAIL_CHANGE: "email_change",
  MFA_ENABLE: "mfa_enable",
  MFA_DISABLE: "mfa_disable",
  MFA_CHALLENGE: "mfa_challenge",
  BACKUP_CODES_GENERATE: "backup_codes_generate",
} as const

export const AUTH_STATUS = {
  SUCCESS: "success",
  FAILURE: "failure",
  PENDING: "pending",
} as const
