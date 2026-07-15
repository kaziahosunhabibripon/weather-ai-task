export type ApiErrorCode =
  | "INVALID_COORDINATES"
  | "INVALID_API_KEY"
  | "QUOTA_EXCEEDED"
  | "UPSTREAM_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK_OFFLINE"
  | "UNKNOWN";

const statusMap: Record<number, ApiErrorCode> = {
  400: "INVALID_COORDINATES",
  401: "INVALID_API_KEY",
  403: "INVALID_API_KEY",
  429: "QUOTA_EXCEEDED",
  500: "UPSTREAM_ERROR",
  503: "SERVICE_UNAVAILABLE",
};

export function errorCodeFromStatus(status: number): ApiErrorCode {
  return statusMap[status] ?? "UNKNOWN";
}

export function errorMessage(code: ApiErrorCode) {
  const messages: Record<ApiErrorCode, string> = {
    INVALID_COORDINATES: "Coordinates are outside the supported range.",
    INVALID_API_KEY: "WeatherAI rejected the API key.",
    QUOTA_EXCEEDED: "Request quota has been exceeded for this period.",
    UPSTREAM_ERROR: "WeatherAI returned a server error.",
    SERVICE_UNAVAILABLE: "WeatherAI is temporarily unavailable.",
    NETWORK_OFFLINE: "Network offline. Cached fallback can remain active.",
    UNKNOWN: "Unexpected weather service error.",
  };

  return messages[code];
}
