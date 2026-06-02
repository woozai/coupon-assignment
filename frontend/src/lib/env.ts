const getRequiredEnvValue = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required frontend environment variable: ${key}`);
  }

  return value;
};

export const frontendEnv = {
  apiBaseUrl: getRequiredEnvValue(
    import.meta.env.VITE_API_BASE_URL,
    'VITE_API_BASE_URL',
  ),
};
