/**
 * Verifica si el microservicio de autenticación está disponible
 */
export async function checkAuthServiceHealth(baseUrl: string): Promise<{ isHealthy: boolean; error?: string }> {
  try {
    // Intentar hacer una petición simple al servicio
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      isHealthy: response.ok,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      isHealthy: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Verifica si el endpoint de login está disponible
 */
export async function checkLoginEndpoint(baseUrl: string): Promise<{ isAvailable: boolean; error?: string }> {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Aceptamos cualquier respuesta (incluso redirecciones) como "disponible"
    return {
      isAvailable: true,
      error: undefined
    };
  } catch (error) {
    return {
      isAvailable: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
