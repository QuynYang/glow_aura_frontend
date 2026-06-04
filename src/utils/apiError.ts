import { isAxiosError } from 'axios';

export type ApiErrorPayload = { message?: string };

export function toApiError(error: unknown, fallback: string): ApiErrorPayload {
  if (isAxiosError(error)) {
    if (!error.response) {
      return {
        message:
          'Không kết nối được máy chủ API. Kiểm tra mạng hoặc tải lại trang (Ctrl+F5).',
      };
    }
    const data = error.response.data as { message?: string; title?: string } | undefined;
    return { message: data?.message || data?.title || fallback };
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as ApiErrorPayload).message;
    if (msg) return { message: msg };
  }
  return { message: fallback };
}
