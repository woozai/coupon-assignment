// Use one shared error type so services and middleware speak the same error language.
export class ApiError extends Error {
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

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}
