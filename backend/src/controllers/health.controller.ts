import type { Request, Response } from 'express';

export const getHealthController = (
  _request: Request,
  response: Response,
): void => {
  response.status(200).json({ status: 'ok' });
};
