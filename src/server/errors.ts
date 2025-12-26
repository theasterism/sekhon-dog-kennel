export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  IDENTITY_REQUIRED: "IDENTITY_REQUIRED",
  SETUP_COMPLETE: "SETUP_COMPLETE",

  // Rate limiting
  RATE_LIMIT: "RATE_LIMIT",

  // Request errors
  BAD_REQUEST: "BAD_REQUEST",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",

  // Server errors
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES = new Map<ErrorCode, string>([
  [ERROR_CODES.INVALID_CREDENTIALS, "Invalid credentials. Please try again."],
  [ERROR_CODES.SESSION_EXPIRED, "Your session has expired. Please login."],
  [ERROR_CODES.IDENTITY_REQUIRED, "Unable to determine client identity."],
  [ERROR_CODES.SETUP_COMPLETE, "Setup has already been completed."],
  [ERROR_CODES.RATE_LIMIT, "Too many requests. Wait a moment."],
  [ERROR_CODES.BAD_REQUEST, "Invalid request. Please check your input."],
  [ERROR_CODES.FORBIDDEN, "Invalid request origin."],
  [ERROR_CODES.NOT_FOUND, "Resource not found."],
  [ERROR_CODES.CONFLICT, "Resource already exists."],
  [ERROR_CODES.SERVER_ERROR, "Something went wrong. Try again later."],
  [ERROR_CODES.NETWORK_ERROR, "Connection failed. Check your internet."],
]);

export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES.get(code) ?? "An unexpected error occurred.";
}

export function createApiError(code: ErrorCode, customMessage?: string) {
  return {
    error: {
      code,
      message: customMessage ?? getErrorMessage(code),
    },
  };
}

export function apiErrorResponse(code: ErrorCode, status: number, customMessage?: string) {
  return new Response(JSON.stringify(createApiError(code, customMessage)), { status });
}
