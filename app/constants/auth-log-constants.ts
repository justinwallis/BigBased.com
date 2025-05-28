// Auth event types
export const AUTH_EVENTS = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  LOGOUT: "logout",
  PASSWORD_CHANGE: "password_change",
  PASSWORD_RESET_REQUEST: "password_reset_request",
  PASSWORD_RESET_SUCCESS: "password_reset_success",
  MFA_SETUP_ATTEMPT: "mfa_setup_attempt",
  MFA_SETUP_SUCCESS: "mfa_setup_success",
  MFA_SETUP_FAILURE: "mfa_setup_failure",
  MFA_VERIFICATION_ATTEMPT: "mfa_verification_attempt",
  MFA_VERIFICATION_SUCCESS: "mfa_verification_success",
  MFA_VERIFICATION_FAILURE: "mfa_verification_failure",
  MFA_SKIPPED: "mfa_skipped",
  BACKUP_CODE_GENERATION: "backup_code_generation",
  BACKUP_CODE_USAGE: "backup_code_usage",
  TRUSTED_DEVICE_ADDED: "trusted_device_added",
  TRUSTED_DEVICE_REMOVED: "trusted_device_removed",
  ACCOUNT_RECOVERY_REQUEST: "account_recovery_request",
  ACCOUNT_RECOVERY_SUCCESS: "account_recovery_success",
} as const

// Auth status types
export const AUTH_STATUS = {
  SUCCESS: "success",
  FAILURE: "failure",
  PENDING: "pending",
} as const

// Type definitions
export type AuthEvent = (typeof AUTH_EVENTS)[keyof typeof AUTH_EVENTS]
export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]
