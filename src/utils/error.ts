export type ErrorTypes =
  | { type: "InvalidCredentials"; message: string }
  | { type: "NetworkError"; message: string }
  | { type: "ValidationError"; message: string }
  | { type: "RatelimitError"; message: string }
  | { type: "Unauthorized"; message: string }
  | { type: "ServerError"; status: number }
  | { type: "SessionExpired"; message: string };

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};
