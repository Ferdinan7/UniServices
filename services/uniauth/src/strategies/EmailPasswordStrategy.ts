// src/strategies/EmailPasswordStrategy.ts

import { IAuthStrategy, AuthCredentials, AuthResult, AuthenticationError } from './IAuthStrategy';

/**
 * Estrategia concreta para autenticación con Email y Password
 *
 * Implementa el patrón Strategy para autenticación local usando
 * email y contraseña contra el backend GraphQL.
 */
export class EmailPasswordStrategy implements IAuthStrategy {
  readonly name = 'email-password';
  readonly type = 'local' as const;

  private backendUrl: string;

  constructor(backendUrl: string = 'http://localhost:3000/graphql') {
    this.backendUrl = backendUrl;
  }

  /**
   * Autentica usuario usando email y password contra GraphQL backend
   */
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      // Validar credenciales antes de proceder
      if (!this.validateCredentials(credentials)) {
        throw new AuthenticationError(
          'Email y password son requeridos',
          'INVALID_CREDENTIALS',
          this.name
        );
      }

      const { email, password } = credentials;

      // Query GraphQL para autenticación
      const query = `
        mutation {
          signInComplete(email: "${email}", password: "${password}")
        }
      `;

      // Llamada al backend
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new AuthenticationError(
          `Error HTTP: ${response.status}`,
          'HTTP_ERROR',
          this.name
        );
      }

      const result = await response.json();

      // Manejar errores de GraphQL
      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors[0].message || 'Error de autenticación';
        throw new AuthenticationError(
          errorMessage,
          'GRAPHQL_ERROR',
          this.name
        );
      }

      // Parsear respuesta del backend (viene como string JSON)
      const authData = JSON.parse(result.data.signInComplete);

      // Guardar tokens en localStorage
      if (authData.access_token) {
        this.saveTokens(authData);
      }

      // Retornar resultado exitoso
      return {
        success: true,
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        user: {
          id: authData.user?.id || '',
          email: authData.user?.email || email,
          name: authData.user?.name,
          provider: 'email',
        },
      };

    } catch (error) {
      // Si ya es AuthenticationError, re-lanzarlo
      if (error instanceof AuthenticationError) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Convertir otros errores
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Valida que las credenciales contengan email y password
   */
  validateCredentials(credentials: AuthCredentials): boolean {
    return !!(
      credentials.email &&
      credentials.email.trim().length > 0 &&
      credentials.password &&
      credentials.password.length > 0
    );
  }

  /**
   * Guarda tokens en localStorage
   */
  private saveTokens(authData: any): void {
    try {
      localStorage.setItem('auth_token', authData.access_token);
      localStorage.setItem('refresh_token', authData.refresh_token);
      localStorage.setItem('user_info', JSON.stringify(authData.user));
      localStorage.setItem('auth_provider', 'email');
    } catch (error) {
      console.error('Error saving tokens to localStorage:', error);
    }
  }

  /**
   * Configuración para UI
   */
  getConfig() {
    return {
      displayName: 'Email & Password',
      icon: '📧',
      buttonText: 'Sign in with Email',
      requiresRedirect: false,
    };
  }

  /**
   * Limpia tokens del localStorage
   */
  static clearTokens(): void {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_provider');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * Obtiene el token actual del localStorage
   */
  static getStoredToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si hay una sesión activa
   */
  static hasActiveSession(): boolean {
    return !!this.getStoredToken();
  }
}
