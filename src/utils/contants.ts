import { getEnv } from './env';

export const PUBLIC_KEY = getEnv('VITE_PUBLIC_KEY', 'test_public_key');
export const URL_INTEGRATION = getEnv('VITE_URL_INTEGRATION', 'https://test.integration');
export const BASE_URL = getEnv('VITE_BASE_URL', 'http://localhost:3000');
export const INTEGRITY = getEnv('VITE_INTEGRITY', 'some_integrity_hash');