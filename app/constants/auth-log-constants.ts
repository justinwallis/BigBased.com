// Event types
export const AUTH_EVENTS = {
  LOGIN_ATTEMPT: "login_attempt",
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  SIGNUP_ATTEMPT: "signup_attempt",
  SIGNUP_SUCCESS: "signup_success",
  SIGNUP_FAILURE: "signup_failure",
  LOGOUT: "logout",
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
  DEVICE_TRUSTED: "device_trusted",
  DEVICE_REMOVED: "device_removed",
  ALL_DEVICES_REMOVED: "all_devices_removed",
}

// Status types
export const AUTH_STATUS = {
  SUCCESS: "success",
  FAILURE: "failure",
  PENDING: "pending",
  CANCELED: "canceled",
}
