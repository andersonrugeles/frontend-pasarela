import '@testing-library/jest-dom';

jest.mock('@/utils/env', () => ({
  getEnv: (key: string, fallback: string) => {
    const mockEnv: Record<string, string> = {
      VITE_PUBLIC_KEY: 'mock_public_key',
      VITE_URL_INTEGRATION: 'https://mock.integration',
      VITE_BASE_URL: 'http://localhost:4000',
      VITE_INTEGRITY: 'mocked_integrity',
    };
    return mockEnv[key] ?? fallback;
  }
}));