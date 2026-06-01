import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler = (
  handler: AsyncRequestHandler,
): RequestHandler => {
  return (request, response, next) => {
    // Forward async failures to Express so controllers stay free of repetitive try/catch.
    void handler(request, response, next).catch(next);
  };
};
