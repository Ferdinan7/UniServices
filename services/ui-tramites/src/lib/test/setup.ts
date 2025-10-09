// Setup for Vitest tests
import '@testing-library/jest-dom';

// Mock del fetch global si no existe
if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}

// Mock para el objeto window si es necesario
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock para sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});