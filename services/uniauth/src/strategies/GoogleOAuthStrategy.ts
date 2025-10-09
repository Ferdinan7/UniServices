// src/strategies/GoogleOAuthStrategy.ts

import { IAuthStrategy, AuthCredentials, AuthResult, AuthenticationError } from './IAuthStrategy';

/**
 * Estrategia concreta para autenticación con Google OAuth
 *
 * Implementa el patrón Strategy para autenticación mediante Google OAuth
 * usando Supabase como proveedor de autenticación.
 */
export class GoogleOAuthStrategy implements IAuthStrategy {
  readonly name = 'google-oauth';
  readonly type = 'oauth' as const;

  private supabaseUrl: string;
  private supabaseAnonKey: string;
  private supabaseClient: any = null;

  constructor(
    supabaseUrl: string = 'https://sirtkdkbqsklncyoallp.supabase.co',
    supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA'
  ) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
  }

  /**
   * Inicializa el cliente de Supabase (lazy loading)
   */
  private async initializeSupabase(): Promise<any> {
    if (this.supabaseClient) {
      return this.supabaseClient;
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      this.supabaseClient = createClient(this.supabaseUrl, this.supabaseAnonKey);
      return this.supabaseClient;
    } catch (error) {
      throw new AuthenticationError(
        'No se pudo cargar el cliente de Supabase',
        'SUPABASE_INIT_ERROR',
        this.name
      );
    }
  }

  /**
   * Autentica usuario usando Google OAuth
   * Inicia el flujo de OAuth que redirige al usuario a Google
   */
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      const supabase = await this.initializeSupabase();

      const redirectTo = credentials.redirectTo || window.location.origin;

      // Iniciar flujo OAuth con Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new AuthenticationError(
          error.message || 'Error al iniciar autenticación con Google',
          'OAUTH_ERROR',
          this.name
        );
      }

      // OAuth requiere redirección, así que retornamos que fue exitoso
      // pero no tenemos tokens todavía (se obtendrán en el callback)
      return {
        success: true,
        redirectUrl: data?.url,
      };

    } catch (error) {
      if (error instanceof AuthenticationError) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en Google OAuth',
      };
    }
  }

  /**
   * Valida que las credenciales sean apropiadas para Google OAuth
   * Para OAuth, no necesitamos credenciales específicas
   */
  validateCredentials(credentials: AuthCredentials): boolean {
    // OAuth no requiere credenciales previas
    // Solo necesita el provider que debe ser 'google'
    return !credentials.provider || credentials.provider === 'google';
  }

  /**
   * Maneja el callback de Google OAuth después de la redirección
   * Extrae y guarda los tokens de la sesión
   */
  async handleCallback(_callbackData?: any): Promise<AuthResult> {
    try {
      const supabase = await this.initializeSupabase();

      // Obtener la sesión actual después del callback OAuth
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw new AuthenticationError(
          error.message || 'Error al obtener sesión de Google',
          'SESSION_ERROR',
          this.name
        );
      }

      if (!session) {
        throw new AuthenticationError(
          'No se pudo obtener la sesión después del login con Google',
          'NO_SESSION',
          this.name
        );
      }

      // Guardar tokens en localStorage
      this.saveTokens(session);

      // Retornar resultado exitoso
      return {
        success: true,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        user: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          provider: 'google',
        },
      };

    } catch (error) {
      if (error instanceof AuthenticationError) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al procesar callback de Google',
      };
    }
  }

  /**
   * Guarda tokens y datos de usuario en localStorage
   */
  private saveTokens(session: any): void {
    try {
      localStorage.setItem('auth_token', session.access_token);
      localStorage.setItem('refresh_token', session.refresh_token);
      localStorage.setItem('user_info', JSON.stringify(session.user));
      localStorage.setItem('auth_provider', 'google');
      localStorage.setItem('session_expires_at', new Date(session.expires_at * 1000).toISOString());
    } catch (error) {
      console.error('Error guardando tokens en localStorage:', error);
    }
  }

  /**
   * Configuración para UI
   */
  getConfig() {
    return {
      displayName: 'Google',
      icon: 'https://www.svgrepo.com/show/475656/google-color.svg',
      buttonText: 'Sign in with Google',
      requiresRedirect: true,
    };
  }

  /**
   * Verifica si estamos en un callback de Google OAuth
   * (detecta parámetros de URL característicos del callback)
   */
  static isOAuthCallback(): boolean {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    return !!(
      urlParams.has('code') ||
      urlParams.has('access_token') ||
      hashParams.has('access_token') ||
      hashParams.has('provider_token')
    );
  }

  /**
   * Limpia los parámetros de OAuth de la URL
   */
  static cleanOAuthParams(): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    // Limpiar query params
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.searchParams.delete('access_token');
    url.searchParams.delete('refresh_token');
    url.searchParams.delete('expires_in');
    url.searchParams.delete('provider_token');
    url.searchParams.delete('token_type');

    // Limpiar hash
    url.hash = '';

    // Actualizar URL sin recargar la página
    window.history.replaceState({}, document.title, url.toString());
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
   * Verifica si hay una sesión activa de Google
   */
  static hasActiveSession(): boolean {
    try {
      const token = localStorage.getItem('auth_token');
      const provider = localStorage.getItem('auth_provider');
      return !!(token && provider === 'google');
    } catch (error) {
      return false;
    }
  }

  /**
   * Cierra sesión y limpia tokens
   */
  static async signOut(): Promise<void> {
    try {
      // Importar Supabase dinámicamente
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://sirtkdkbqsklncyoallp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA'
      );

      // Cerrar sesión en Supabase
      await supabase.auth.signOut();

      // Limpiar localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_provider');
      localStorage.removeItem('session_expires_at');
    } catch (error) {
      console.error('Error al cerrar sesión de Google:', error);
      // Limpiar localStorage de todas formas
      localStorage.clear();
    }
  }
}
