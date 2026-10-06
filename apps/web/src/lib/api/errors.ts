import type { ApiErrorBody } from '@brandviserproductions/contracts';

/** A non-2xx API response, with per-field validation messages when the API sent them. */
export class ApiError extends Error {
  readonly status: number;
  readonly fields: Record<string, string>;

  constructor(status: number, body: Partial<ApiErrorBody> | null) {
    const message = Array.isArray(body?.message) ? body.message.join('. ') : (body?.message ?? `Request failed (${status})`);
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = body?.fields ?? {};
  }

  get isValidation(): boolean {
    return this.status === 400 && Object.keys(this.fields).length > 0;
  }
}

export async function toApiError(res: Response): Promise<ApiError> {
  const body = (await res.json().catch(() => null)) as Partial<ApiErrorBody> | null;
  return new ApiError(res.status, body);
}
