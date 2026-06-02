import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { AdminLoginRequest } from '../types/auth.types';

const ADMIN_TOKEN_STORAGE_KEY = 'admin_access_token';

interface UseAdminSessionResult {
  accessToken: string | null;
  errorMessage: string | null;
  isSubmitting: boolean;
  login: (loginInput: AdminLoginRequest) => Promise<void>;
  logout: () => void;
}

const getStoredAccessToken = (): string | null => {
  return window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
};

export const useAdminSession = (): UseAdminSessionResult => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Restore the stored token so a page refresh does not drop the in-memory session state.
    setAccessToken(getStoredAccessToken());
  }, []);

  const login = async (loginInput: AdminLoginRequest): Promise<void> => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const loginResponse = await authService.loginAdmin(loginInput);

      // Keep the token in session storage so the admin stays signed in during a browser tab session.
      window.sessionStorage.setItem(
        ADMIN_TOKEN_STORAGE_KEY,
        loginResponse.token,
      );
      setAccessToken(loginResponse.token);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to log in as admin.',
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = (): void => {
    // Clear both persisted and in-memory auth state so protected screens fall back immediately.
    window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setAccessToken(null);
    setErrorMessage(null);
  };

  return {
    accessToken,
    errorMessage,
    isSubmitting,
    login,
    logout,
  };
};
