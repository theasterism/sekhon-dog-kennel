import { Result } from "@/utils/result";

export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  IDENTITY_REQUIRED: "IDENTITY_REQUIRED",
  SETUP_COMPLETE: "SETUP_COMPLETE",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Rate limiting
  RATE_LIMIT: "RATE_LIMIT",

  // Request errors
  BAD_REQUEST: "BAD_REQUEST",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",

  // Resource-specific errors
  DOG_NOT_FOUND: "DOG_NOT_FOUND",
  IMAGE_NOT_FOUND: "IMAGE_NOT_FOUND",
  APPLICATION_NOT_FOUND: "APPLICATION_NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",

  // Upload errors
  UPLOAD_FAILED: "UPLOAD_FAILED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",

  // Server errors
  SERVER_ERROR: "SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES = new Map<ErrorCode, string>([
  // Auth
  [ERROR_CODES.INVALID_CREDENTIALS, "Invalid credentials. Please try again."],
  [ERROR_CODES.SESSION_EXPIRED, "Your session has expired. Please login."],
  [ERROR_CODES.IDENTITY_REQUIRED, "Unable to determine client identity."],
  [ERROR_CODES.SETUP_COMPLETE, "Setup has already been completed."],
  [ERROR_CODES.UNAUTHORIZED, "You must be logged in to perform this action."],

  // Rate limiting
  [ERROR_CODES.RATE_LIMIT, "Too many requests. Wait a moment."],

  // Request errors
  [ERROR_CODES.BAD_REQUEST, "Invalid request. Please check your input."],
  [ERROR_CODES.FORBIDDEN, "You don't have permission to perform this action."],
  [ERROR_CODES.NOT_FOUND, "Resource not found."],
  [ERROR_CODES.CONFLICT, "Resource already exists."],
  [ERROR_CODES.VALIDATION_ERROR, "Please check your input and try again."],
  [ERROR_CODES.PAYLOAD_TOO_LARGE, "Request payload is too large."],
  [ERROR_CODES.UNSUPPORTED_MEDIA_TYPE, "File type is not supported."],

  // Resource-specific
  [ERROR_CODES.DOG_NOT_FOUND, "Dog not found."],
  [ERROR_CODES.IMAGE_NOT_FOUND, "Image not found."],
  [ERROR_CODES.APPLICATION_NOT_FOUND, "Application not found."],
  [ERROR_CODES.USER_NOT_FOUND, "User not found."],

  // Upload errors
  [ERROR_CODES.UPLOAD_FAILED, "Failed to upload file. Please try again."],
  [ERROR_CODES.FILE_TOO_LARGE, "File size exceeds the maximum allowed."],
  [ERROR_CODES.INVALID_FILE_TYPE, "Only images (JPG, PNG, WebP) are allowed."],

  // Server errors
  [ERROR_CODES.SERVER_ERROR, "Something went wrong. Try again later."],
  [ERROR_CODES.DATABASE_ERROR, "A database error occurred. Please try again."],
  [ERROR_CODES.NETWORK_ERROR, "Connection failed. Check your internet."],
]);

export type ApiError = {
  code: ErrorCode;
  status: number;
  message: string;
};

export type ApiResult<T> = Result<T, ApiError>;

export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES.get(code) ?? "An unexpected error occurred.";
}

export function apiError(code: ErrorCode, status: number, message?: string): ApiError {
  return { code, status, message: message ?? getErrorMessage(code) };
}

export function apiErrorResponse(error: ApiError): Response {
  return new Response(
    JSON.stringify({ error: { code: error.code, message: error.message } }),
    { status: error.status, headers: { "Content-Type": "application/json" } },
  );
}
