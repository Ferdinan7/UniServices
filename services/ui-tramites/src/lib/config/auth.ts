// Configuración del microservicio de autenticación
export const AUTH_CONFIG = {
  // UI de autenticación con Stencil
  AUTH_UI_URL: 'http://localhost:3333',

  // Backend API Gateway
  BACKEND_URL: 'http://localhost:4000',

  // Endpoints del servicio de autenticación a través del API Gateway
  ENDPOINTS: {
    LOGIN: '/', // La UI de Stencil probablemente esté en la raíz
    LOGOUT: '/logout',
    VERIFY_TOKEN: '/api/v1/auth/validate' // Endpoint REST del API Gateway
  },

  // Parámetros de redirección
  REDIRECT_PARAMS: {
    REDIRECT_URI: 'redirect_uri',
    ACCESS_TOKEN: 'access_token'
  }
};

// Función helper para construir URLs de autenticación
export function buildAuthUrl(endpoint: string, redirectUri?: string): string {
  const baseUrl = AUTH_CONFIG.AUTH_UI_URL + endpoint;
  const url = new URL(baseUrl);

  if (redirectUri) {
    url.searchParams.set(AUTH_CONFIG.REDIRECT_PARAMS.REDIRECT_URI, redirectUri);
  }

  return url.toString();
}

// Función helper para construir URLs del backend
export function buildBackendUrl(endpoint: string): string {
  return AUTH_CONFIG.BACKEND_URL + endpoint;
}
