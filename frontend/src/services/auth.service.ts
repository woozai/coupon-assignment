import { apiClient } from '../lib/api-client';
import { AdminLoginRequest, AuthTokenResponse } from '../types/auth.types';

export const authService = {
  loginAdmin: async (
    loginInput: AdminLoginRequest,
  ): Promise<AuthTokenResponse> => {
    return apiClient.request<AuthTokenResponse>('/api/admin/login', {
      body: loginInput,
      method: 'POST',
    });
  },
};
