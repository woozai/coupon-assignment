import { frontendEnv } from './env';
import { ApiErrorResponse } from '../types/api.types';

interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  accessToken?: string;
  body?: unknown;
  headers?: HeadersInit;
}

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'errorCode' in value && 'message' in value;
};

export class ApiClientError extends Error {
  public readonly details?: unknown;
  public readonly errorCode: string;
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    details?: unknown,
  ) {
    super(message);

    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

const buildHeaders = (options: RequestOptions): Headers => {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  return headers;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
};

const toRequestBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined) {
    return undefined;
  }

  return JSON.stringify(body);
};

export const apiClient = {
  request: async <TResponse>(
    path: string,
    options: RequestOptions = {},
  ): Promise<TResponse> => {
    const response = await fetch(`${frontendEnv.apiBaseUrl}${path}`, {
      ...options,
      body: toRequestBody(options.body),
      headers: buildHeaders(options),
    });
    const responseBody = await parseResponseBody(response);

    // Preserve the backend error contract so pages can branch on error codes consistently.
    if (!response.ok) {
      if (isApiErrorResponse(responseBody)) {
        throw new ApiClientError(
          responseBody.message,
          response.status,
          responseBody.errorCode,
          responseBody.details,
        );
      }

      throw new ApiClientError(
        'Unexpected API error.',
        response.status,
        'UNEXPECTED_API_ERROR',
      );
    }

    return responseBody as TResponse;
  },
};
