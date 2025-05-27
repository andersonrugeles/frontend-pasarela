export const getEnv = (key: keyof ImportMetaEnv, fallback?: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }

  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }

  if (fallback !== undefined) return fallback;

  throw new Error(`Missing environment variable: ${key}`);
};