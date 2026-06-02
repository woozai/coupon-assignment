import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  AdminLoginInput,
  AuthTokenResponse,
} from '../types/auth.types.js';

// Keep auth controllers small so credential checks and token logic stay inside the auth service.
export const adminLoginController = asyncHandler<
  Record<string, never>,
  AuthTokenResponse,
  AdminLoginInput
>(
  async (
    request: Request<Record<string, never>, AuthTokenResponse, AdminLoginInput>,
    response: Response<AuthTokenResponse>,
  ): Promise<void> => {
    const token = await authService.loginAdmin(request.body);

    response.status(200).json({ token });
  },
);
