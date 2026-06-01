import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';
import {
  AdminLoginInput,
  AuthenticatedUser,
  AuthRole,
} from '../types/auth.types.js';

const getJwtPayload = (token: string): AuthenticatedUser => {
  const decodedToken = jwt.verify(token, env.JWT_SECRET);

  if (typeof decodedToken === 'string') {
    throw new ApiError('Invalid authentication token.', 401, 'UNAUTHORIZED');
  }

  const { email, role, sub } = decodedToken;

  if (
    typeof sub !== 'string' ||
    (role !== 'admin' && role !== 'reseller')
  ) {
    throw new ApiError('Invalid authentication token.', 401, 'UNAUTHORIZED');
  }

  return {
    ...(typeof email === 'string' ? { email } : {}),
    role,
    sub,
  };
};

export const authService = {
  issueToken: (subject: string, role: AuthRole, email?: string): string => {
    const tokenExpiresIn = env.JWT_EXPIRES_IN as SignOptions['expiresIn'];

    return jwt.sign(
      {
        ...(email ? { email } : {}),
        role,
      },
      env.JWT_SECRET,
      {
        expiresIn: tokenExpiresIn,
        subject,
      },
    );
  },

  loginAdmin: async (loginInput: AdminLoginInput): Promise<string> => {
    if (loginInput.email !== env.ADMIN_EMAIL) {
      throw new ApiError('Invalid admin credentials.', 401, 'UNAUTHORIZED');
    }

    const passwordMatches = await bcrypt.compare(
      loginInput.password,
      env.ADMIN_PASSWORD_HASH,
    );

    if (!passwordMatches) {
      throw new ApiError('Invalid admin credentials.', 401, 'UNAUTHORIZED');
    }

    // Keep the admin identity small and env-backed so the assignment avoids full user management.
    return authService.issueToken('admin-local', 'admin', env.ADMIN_EMAIL);
  },

  verifyToken: (token: string): AuthenticatedUser => {
    return getJwtPayload(token);
  },
};
