// src/services/AuthService.ts

import { IAuthStrategy, AuthCredentials, AuthResult } from '../strategies/IAuthStrategy';
import { EmailPasswordStrategy } from '../strategies/EmailPasswordStrategy';
import { GoogleOAuthStrategy } from '../strategies/GoogleOAuthStrategy';

/**
 * AuthService - Context del patrón Strategy
 *
 * Este servicio actúa como el "Context" en el patrón Strategy.
 * Mantiene una referencia a la estrategia actual y delega
 * las operaciones de autenticación a la estrategia seleccionada.
 *
 * Patrón Strategy:
 * - Context: AuthService (este archivo)
 * - Strategy: IAuthStrategy (interfaz)
 * - ConcreteStrategy: EmailPasswordStrategy, GoogleOAuthStrategy
 *
 * Ventajas:
 * - Fácil agregar nuevas estrategias sin modificar código existente
 * - Permite cambiar de estrategia en tiempo de ejecución
 * - Encapsula la lógica de cada estrategia
 * - Código más limpio y mantenible
 */
export class AuthService {
  private strategy: IAuthStrategy | null = null;
  private strategies: Map<string, IAuthStrategy> = new Map();

  constructor() {
    this.initializeStrategies();
  }

  /**
   * Inicializa y registra todas las estrategias disponibles
   */
  private initializeStrategies(): void {
    // Registrar estrategia de Email/Password
    const emailStrategy = new EmailPasswordStrategy();
    this.registerStrategy(emailStrategy);

    // Registrar estrategia de Google OAuth
    const googleStrategy = new GoogleOAuthStrategy();
    this.registerStrategy(googleStrategy);

    // Establecer estrategia por defecto
    this.strategy = emailStrategy;
  }

  /**
   * Registra una nueva estrategia en el servicio
   *
   * @param strategy - Estrategia a registrar
   */
  registerStrategy(strategy: IAuthStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * Establece la estrategia actual a usar
   *
   * @param strategyName - Nombre de la estrategia ('email-password' o 'google-oauth')
   * @throws Error si la estrategia no existe
   */
  setStrategy(strategyName: string): void {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      throw new Error(
        `Estrategia '${strategyName}' no encontrada. Estrategias disponibles: ${Array.from(this.strategies.keys()).join(', ')}`
      );
    }

    this.strategy = strategy;
  }

  /**
   * Obtiene la estrategia actual
   */
  getStrategy(): IAuthStrategy | null {
    return this.strategy;
  }

  /**
   * Obtiene todas las estrategias registradas
   */
  getAllStrategies(): IAuthStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Obtiene una estrategia específica por nombre
   */
  getStrategyByName(name: string): IAuthStrategy | undefined {
    return this.strategies.get(name);
  }

  /**
   * Autentica usando la estrategia actual
   *
   * @param credentials - Credenciales para autenticación
   * @returns Promise con el resultado de la autenticación
   * @throws Error si no hay estrategia seleccionada
   */
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    if (!this.strategy) {
      throw new Error('No hay estrategia de autenticación seleccionada');
    }

    console.log(`🔐 Autenticando con estrategia: ${this.strategy.name}`);

    // Validar credenciales antes de autenticar
    if (!this.strategy.validateCredentials(credentials)) {
      return {
        success: false,
        error: `Credenciales inválidas para la estrategia ${this.strategy.name}`,
      };
    }

    // Delegar la autenticación a la estrategia
    const result = await this.strategy.authenticate(credentials);

    if (result.success) {
      console.log(`✅ Autenticación exitosa con ${this.strategy.name}`);
    } else {
      console.error(`❌ Autenticación fallida con ${this.strategy.name}:`, result.error);
    }

    return result;
  }

  /**
   * Autentica con Email y Password
   * Shortcut que establece la estrategia y autentica en un solo paso
   */
  async authenticateWithEmailPassword(email: string, password: string): Promise<AuthResult> {
    this.setStrategy('email-password');
    return this.authenticate({ email, password });
  }

  /**
   * Autentica con Google OAuth
   * Shortcut que establece la estrategia y autentica en un solo paso
   */
  async authenticateWithGoogle(redirectTo?: string): Promise<AuthResult> {
    this.setStrategy('google-oauth');
    return this.authenticate({ provider: 'google', redirectTo });
  }

  /**
   * Maneja el callback de OAuth después de la redirección
   *
   * @param strategyName - Nombre de la estrategia OAuth
   * @param callbackData - Datos del callback
   */
  async handleOAuthCallback(strategyName: string, callbackData?: any): Promise<AuthResult> {
    const strategy = this.strategies.get(strategyName);

    if (!strategy) {
      return {
        success: false,
        error: `Estrategia '${strategyName}' no encontrada`,
      };
    }

    if (!strategy.handleCallback) {
      return {
        success: false,
        error: `La estrategia '${strategyName}' no soporta callbacks`,
      };
    }

    console.log(`🔄 Procesando callback de ${strategyName}`);

    const result = await strategy.handleCallback(callbackData);

    if (result.success) {
      console.log(`✅ Callback procesado exitosamente para ${strategyName}`);
    } else {
      console.error(`❌ Error procesando callback de ${strategyName}:`, result.error);
    }

    return result;
  }

  /**
   * Obtiene configuración de una estrategia para UI
   */
  getStrategyConfig(strategyName: string): any {
    const strategy = this.strategies.get(strategyName);
    return strategy?.getConfig?.() || null;
  }

  /**
   * Obtiene configuración de todas las estrategias para UI
   */
  getAllStrategyConfigs(): Array<{ name: string; config: any }> {
    return Array.from(this.strategies.entries()).map(([name, strategy]) => ({
      name,
      config: strategy.getConfig?.() || {},
    }));
  }

  /**
   * Verifica si hay una sesión activa (cualquier estrategia)
   */
  static hasActiveSession(): boolean {
    try {
      return !!localStorage.getItem('auth_token');
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene el proveedor de autenticación actual
   */
  static getCurrentProvider(): string | null {
    try {
      return localStorage.getItem('auth_provider');
    } catch (error) {
      return null;
    }
  }

  /**
   * Cierra sesión (limpia tokens)
   */
  static async signOut(): Promise<void> {
    const provider = AuthService.getCurrentProvider();

    try {
      // Si es Google, usar su método de signOut
      if (provider === 'google') {
        const { GoogleOAuthStrategy } = await import('../strategies/GoogleOAuthStrategy');
        await GoogleOAuthStrategy.signOut();
      } else {
        // Para email/password, solo limpiar localStorage
        const { EmailPasswordStrategy } = await import('../strategies/EmailPasswordStrategy');
        EmailPasswordStrategy.clearTokens();
      }

      console.log('✅ Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar localStorage de todas formas
      localStorage.clear();
    }
  }

  /**
   * Obtiene información del usuario actual del localStorage
   */
  static getCurrentUser(): any {
    try {
      const userInfo = localStorage.getItem('user_info');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtiene el token de acceso actual
   */
  static getAccessToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtiene el refresh token actual
   */
  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem('refresh_token');
    } catch (error) {
      return null;
    }
  }
}

/**
 * Instancia singleton del AuthService para uso global
 */
export const authService = new AuthService();
