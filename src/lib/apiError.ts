import axios from "axios";

/** Normalised error thrown by every service function. */
export interface ApiError {
  code: string;
  message: string;
  /** Human-readable text from the backend, safe to show in the UI. */
  userMessage: string;
  status?: number;
}

/** Converts an axios/unknown error into an ApiError with a user-facing message. */
export function toApiError(error: unknown, fallback: string): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiError> | undefined;
    if (error.response) {
      return {
        code: data?.code ?? "HTTP_" + error.response.status,
        message: data?.message ?? error.message,
        userMessage: data?.userMessage ?? data?.message ?? fallback,
        status: error.response.status,
      };
    }
    return {
      code: "NETWORK_ERROR",
      message: error.message,
      userMessage: "Cannot reach the LankaTrails API. Check that the backend is running.",
    };
  }
  return { code: "UNKNOWN_ERROR", message: String(error), userMessage: fallback };
}

/** Message to display for anything thrown by a service function. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "userMessage" in error) {
    return String((error as ApiError).userMessage);
  }
  return fallback;
}
