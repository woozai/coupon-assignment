import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type AsyncRequestHandler<
  TParams = ParamsDictionary,
  TResponseBody = unknown,
  TRequestBody = unknown,
  TRequestQuery = ParsedQs,
> = (
  request: Request<TParams, TResponseBody, TRequestBody, TRequestQuery>,
  response: Response<TResponseBody>,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler = <
  TParams = ParamsDictionary,
  TResponseBody = unknown,
  TRequestBody = unknown,
  TRequestQuery = ParsedQs,
>(
  handler: AsyncRequestHandler<
    TParams,
    TResponseBody,
    TRequestBody,
    TRequestQuery
  >,
): RequestHandler<TParams, TResponseBody, TRequestBody, TRequestQuery> => {
  return (request, response, next) => {
    // Forward async failures to Express so controllers stay free of repetitive try/catch.
    void handler(request, response, next).catch(next);
  };
};
