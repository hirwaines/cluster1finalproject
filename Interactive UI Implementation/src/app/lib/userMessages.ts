export const AUTH_ERRORS = {
  missingCredentials: 'Enter your email and password to sign in.',
  pendingApproval:
    'Your account is awaiting NCST administrator approval. You will receive an email when approved.',
  disabled: 'This account has been disabled. Contact your institution administrator or NCST support.',
  invalidLogin: 'Email or password is incorrect. Check your credentials or reset your password.',
  invalidMfa: 'That verification code is invalid or expired. Request a new code and try again.',
  missingMfa: 'Enter the 6-digit verification code sent to your email.',
  missingEmail: 'Enter your email address to continue.',
} as const;

export const AUTH_SUCCESS = {
  login: 'Welcome back!',
  mfaPrompt: 'Enter the 6-digit code from your email or the backend terminal.',
  mfaVerified: 'Verified. Welcome back!',
  passwordReset: 'If that email exists, a reset code has been sent.',
} as const;

export const ACCESS_ERRORS = {
  forbidden: "You don't have access to this section.",
  notAuthenticated: 'Sign in to continue.',
} as const;

export const FORM_ERRORS = {
  required: 'This field is required.',
  invalidEmail: 'Enter a valid email address.',
  passwordTooShort: 'Password must be at least 8 characters.',
} as const;

export const ACTION_SUCCESS = {
  saved: 'Changes saved successfully.',
  submitted: 'Submitted successfully.',
  deleted: 'Removed successfully.',
  approved: 'Approved successfully.',
  rejected: 'Rejected successfully.',
} as const;

export const ACTION_ERRORS = {
  generic: 'Something went wrong. Please try again.',
  network: 'Unable to reach the server. Check your connection and try again.',
  notFound: 'The requested item could not be found.',
} as const;
