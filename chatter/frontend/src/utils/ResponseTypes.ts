/**
 * Represents the response object returned when registering a user.
 */
export interface RegisterResponse {
  token: string;
  message: string;
}

/**
 * Represents the response structure for an error.
 */
export interface ErrorResponse {
  error: string;
}
