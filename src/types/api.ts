/**
 * Shared types for the Student Square API.
 * Mirrors the backend envelope from src/shared/sendResponse.ts on the server.
 */

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
};

/** Top-level shape returned by every API endpoint. */
export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  meta: PaginationMeta | null;
  data: T | null;
};

export type ApiErrorEnvelope = {
  success: false;
  message: string;
  error: unknown;
};

/** Shape services return for paginated list endpoints. */
export type Paginated<T> = {
  meta: PaginationMeta;
  data: T[];
};

/** Thrown by apiFetch when the backend returns `success: false` or a non-2xx status. */
export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/** Convenience predicate so callers can branch on error type. */
export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
