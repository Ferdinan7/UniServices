// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/lib/supabase/supabase.service';

/**
 * Servicio de autenticación que utiliza Supabase
 * Ahora con logging automático gracias al patrón Decorator
 *
 * Todas las operaciones son loggeadas automáticamente sin necesidad
 * de agregar código de logging manualmente en cada método
 */
@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Registra un nuevo usuario
   * Log automático: "🔐 Iniciando SIGN_UP para user@example.com"
   */
  async signUp(email: string, password: string) {
    // El decorator intercepta la llamada y loggea automáticamente
    const { data, error } = await this.supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);
    return data; // Retorna user y session
  }

  /**
   * Inicia sesión con email y password
   * Log automático: "🔐 Iniciando SIGN_IN para user@example.com"
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);
    return data; // Retorna user y session (con access_token)
  }

  /**
   * Obtiene información del usuario por token
   * Log automático: "🔐 Iniciando GET_USER"
   */
  async getUser(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error) throw new Error(error.message);
    return data.user;
  }

  /**
   * Refresca el token de sesión
   * Log automático: "🔐 Iniciando REFRESH_TOKEN"
   */
  async refreshToken(refresh_token: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) throw new Error(error.message);
    return data; // Retorna nueva session con access_token y refresh_token
  }

  /**
   * Cierra sesión del usuario
   * Log automático: "🔐 Iniciando SIGN_OUT"
   */
  async logout(token: string) {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return { message: 'Logout successful' };
  }

  /**
   * Valida si un token es válido
   * Log automático: "🔐 Iniciando GET_USER" (usa getUser internamente)
   */
  async validateToken(token: string) {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error || !data.user) {
        return { valid: false, error: error?.message || 'Invalid token' };
      }

      return {
        valid: true,
        user: data.user,
        expires_at: data.user.last_sign_in_at,
      };
    } catch (err) {
      return { valid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Obtiene información completa del usuario
   * Log automático con resultado
   */
  async getUserInfo(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error) throw new Error(error.message);

    return {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role || 'authenticated',
      email_confirmed_at: data.user.email_confirmed_at,
      last_sign_in_at: data.user.last_sign_in_at,
      created_at: data.user.created_at,
      app_metadata: data.user.app_metadata,
      user_metadata: data.user.user_metadata,
    };
  }

  /**
   * Método mejorado para signIn que retorna toda la información necesaria
   * Incluye logging detallado de toda la operación
   */
  async signInComplete(email: string, password: string) {
    // Log automático: operación completa con duración y resultado
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw new Error(error.message);

    return {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
      expires_in: data.session?.expires_in,
      token_type: data.session?.token_type || 'bearer',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.role || 'authenticated',
        email_confirmed_at: data.user?.email_confirmed_at,
        last_sign_in_at: data.user?.last_sign_in_at,
      },
    };
  }

  /**
   * EJEMPLO: Uso avanzado con query builder
   * El decorator loggea automáticamente:
   * - "🔍 Ejecutando SELECT en tabla [users]"
   * - Filtros aplicados (eq, limit, etc.)
   * - Resultado: "✅ SELECT completado en [users] (45ms) - 1 registro(s)"
   */
  async getUserByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * EJEMPLO: Operación de INSERT con logging automático
   * Log: "🔍 Ejecutando INSERT en tabla [user_logs]"
   * Log: "✅ INSERT completado en [user_logs] (32ms) - 1 registro(s)"
   */
  async logUserAction(userId: string, action: string) {
    const { data, error } = await this.supabase
      .from('user_logs')
      .insert({
        user_id: userId,
        action: action,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // El error ya fue loggeado automáticamente por el decorator
      this.supabase
        .getLogger()
        .warn('No se pudo registrar la acción del usuario', {
          userId,
          action,
          error: error.message,
        });
      // No lanzar error para no interrumpir el flujo principal
      return null;
    }

    return data;
  }

  /**
   * EJEMPLO: Operación UPDATE con logging
   * Log: "🔍 Ejecutando UPDATE en tabla [users]"
   * Log: "📝 Parámetros: { fields: ['last_login_at'] }"
   * Log: "✅ UPDATE completado en [users] (28ms)"
   */
  async updateLastLogin(userId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
