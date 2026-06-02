import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import {
  createUnauthorizedError,
} from '../utils/domain-errors.js';
import {
  AdminLoginInput,
  AuthenticatedUser,
  AuthRole,
} from '../types/auth.types.js';

const getJwtPayload = (token: string): AuthenticatedUser => {
  const decodedToken = jwt.verify(token, env.JWT_SECRET);

  if (typeof decodedToken === 'string') {
    throw createUnauthorizedError('Invalid authentication token.');
  }

  const { email, role, sub } = decodedToken;

  if (
    typeof sub !== 'string' ||
    (role !== 'admin' && role !== 'reseller')
  ) {
    throw createUnauthorizedError('Invalid authentication token.');
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
      throw createUnauthorizedError('Invalid admin credentials.');
    }

    const passwordMatches = await bcrypt.compare(
      loginInput.password,
      env.ADMIN_PASSWORD_HASH,
    );

    if (!passwordMatches) {
      throw createUnauthorizedError('Invalid admin credentials.');
    }

    // Issue a fixed admin identity so protected admin routes can rely on a stable role-bearing token.
    return authService.issueToken('admin-local', 'admin', env.ADMIN_EMAIL);
  },

  verifyToken: (token: string): AuthenticatedUser => {
    return getJwtPayload(token);
  },
};
