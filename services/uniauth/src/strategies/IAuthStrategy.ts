// src/strategies/IAuthStrategy.ts

/**
 * Interfaz Strategy para diferentes estrategias de autenticación
 *
 * Patrón Strategy (Estrategia):
 * Define una familia de algoritmos (estrategias de autenticación),
 * encapsula cada uno de ellos y los hace intercambiables.
 *
 * Permite que el algoritmo varíe independientemente de los clientes que lo usan.
 */

/**
 * Resultado de una autenticación exitosa
 */
export interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    provider?: string;
  };
  error?: string;
  redirectUrl?: string;
}

/**
 * Credenciales para autenticación
 * Puede contener diferentes campos según la estrategia
 */
export interface AuthCredentials {
  email?: string;
  password?: string;
  provider?: 'google' | 'facebook' | 'github';
  redirectTo?: string;
  [key: string]: any; // Permite campos adicionales específicos de cada estrategia
}

/**
 * Interfaz Strategy base para todas las estrategias de autenticación
 *
 * Cada estrategia concreta debe implementar esta interfaz
 */
export interface IAuthStrategy {
  /**
   * Nombre único de la estrategia
   * Ejemplo: 'email-password', 'google-oauth', 'facebook-oauth'
   */
  readonly name: string;

  /**
   * Tipo de estrategia para categorización
   * 'local' para email/password, 'oauth' para proveedores externos
   */
  readonly type: 'local' | 'oauth' | 'social' | 'sso';

  /**
   * Ejecuta la autenticación con las credenciales proporcionadas
   *
   * @param credentials - Credenciales específicas de la estrategia
   * @returns Promise con el resultado de la autenticación
   */
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;

  /**
   * Valida si las credenciales son apropiadas para esta estrategia
   *
   * @param credentials - Credenciales a validar
   * @returns true si las credenciales son válidas para esta estrategia
   */
  validateCredentials(credentials: AuthCredentials): boolean;

  /**
   * Maneja el callback después de una autenticación exitosa (opcional)
   * Útil para estrategias OAuth que requieren manejar redirecciones
   *
   * @param callbackData - Datos del callback (query params, hash, etc.)
   * @returns Promise con el resultado procesado
   */
  handleCallback?(callbackData: any): Promise<AuthResult>;

  /**
   * Obtiene información de configuración de la estrategia (opcional)
   * Útil para UI que necesita saber qué mostrar
   */
  getConfig?(): {
    displayName: string;
    icon?: string;
    buttonText?: string;
    requiresRedirect?: boolean;
  };
}

/**
 * Tipo para registro de estrategias
 */
export type AuthStrategyRegistry = Map<string, IAuthStrategy>;

/**
 * Error personalizado para autenticación
 */
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly strategy?: string
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
