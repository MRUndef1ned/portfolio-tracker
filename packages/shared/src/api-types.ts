export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: Record<string, unknown>;
  errors: null;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown[];
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  errors: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function successResponse<T>(
  data: T,
  meta: Record<string, unknown> = {}
): ApiSuccessResponse<T> {
  return { success: true, data, meta, errors: null };
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown[]
): ApiErrorResponse {
  return { success: false, data: null, errors: { code, message, details } };
}
