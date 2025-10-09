// src/lib/logger/supabase-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface QueryLog {
  operation: string;
  table?: string;
  method: string;
  timestamp: Date;
  duration?: number;
  params?: any;
  result?: any;
  error?: any;
  userId?: string;
}

@Injectable()
export class SupabaseLoggerService {
  private readonly logger = new Logger('SupabaseClient');
  private readonly enableDetailedLogs: boolean;
  private readonly enableQueryParams: boolean;

  constructor() {
    // Configuración desde variables de entorno
    this.enableDetailedLogs = process.env.SUPABASE_DETAILED_LOGS === 'true';
    this.enableQueryParams = process.env.SUPABASE_LOG_PARAMS === 'true';
  }

  /**
   * Log cuando se inicia una query
   */
  logQueryStart(operation: string, table?: string, params?: any): void {
    const message = table
      ? `🔍 Ejecutando ${operation} en tabla [${table}]`
      : `🔍 Ejecutando ${operation}`;

    this.logger.log(message);

    if (this.enableDetailedLogs && params) {
      this.logger.debug(`📝 Parámetros: ${this.formatParams(params)}`);
    }
  }

  /**
   * Log cuando se completa una query exitosamente
   */
  logQuerySuccess(
    operation: string,
    table?: string,
    duration?: number,
    result?: any,
  ): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    const message = table
      ? `✅ ${operation} completado en [${table}]${durationStr}`
      : `✅ ${operation} completado${durationStr}`;

    this.logger.log(message);

    if (this.enableDetailedLogs && result) {
      const resultSummary = this.getResultSummary(result);
      if (resultSummary) {
        this.logger.debug(`📊 Resultado: ${resultSummary}`);
      }
    }
  }

  /**
   * Log cuando ocurre un error en una query
   */
  logQueryError(
    operation: string,
    table?: string,
    duration?: number,
    error?: any,
    params?: any,
  ): void {
    const durationStr = duration ? ` (${duration}ms)` : '';
    const message = table
      ? `❌ Error en ${operation} en tabla [${table}]${durationStr}`
      : `❌ Error en ${operation}${durationStr}`;

    this.logger.error(message);

    if (error) {
      this.logger.error(`💥 Error: ${this.formatError(error)}`);
    }

    if (this.enableQueryParams && params) {
      this.logger.error(`📝 Parámetros: ${this.formatParams(params)}`);
    }
  }

  /**
   * Log completo de una operación
   */
  logQuery(log: QueryLog): void {
    const { operation, table, duration, error, result } = log;

    if (error) {
      this.logQueryError(operation, table, duration, error, log.params);
    } else {
      this.logQuerySuccess(operation, table, duration, result);
    }
  }

  /**
   * Log para operaciones de autenticación
   */
  logAuthOperation(
    operation: string,
    email?: string,
    success: boolean = true,
    error?: any,
  ): void {
    const emailMask = email ? this.maskEmail(email) : 'unknown';

    if (success) {
      this.logger.log(`🔐 Auth: ${operation} exitoso para ${emailMask}`);
    } else {
      this.logger.error(`🔐 Auth: ${operation} falló para ${emailMask}`);
      if (error) {
        this.logger.error(`💥 Error: ${this.formatError(error)}`);
      }
    }
  }

  /**
   * Log de información general
   */
  info(message: string, context?: any): void {
    this.logger.log(message);
    if (this.enableDetailedLogs && context) {
      this.logger.debug(`Context: ${JSON.stringify(context, null, 2)}`);
    }
  }

  /**
   * Log de advertencia
   */
  warn(message: string, context?: any): void {
    this.logger.warn(message);
    if (context) {
      this.logger.warn(`Context: ${JSON.stringify(context, null, 2)}`);
    }
  }

  /**
   * Log de error
   */
  error(message: string, error?: any, context?: any): void {
    this.logger.error(message);
    if (error) {
      this.logger.error(`Error: ${this.formatError(error)}`);
    }
    if (context) {
      this.logger.error(`Context: ${JSON.stringify(context, null, 2)}`);
    }
  }

  /**
   * Log de debug (solo en modo detallado)
   */
  debug(message: string, data?: any): void {
    if (this.enableDetailedLogs) {
      this.logger.debug(message);
      if (data) {
        this.logger.debug(JSON.stringify(data, null, 2));
      }
    }
  }

  // ==================== Métodos Privados ====================

  /**
   * Formatea los parámetros para logging
   */
  private formatParams(params: any): string {
    try {
      if (!params) return 'ninguno';

      // Si es un objeto simple, formatearlo bien
      if (typeof params === 'object') {
        const sanitized = this.sanitizeParams(params);
        return JSON.stringify(sanitized, null, 2);
      }

      return String(params);
    } catch (err) {
      return 'Error al formatear parámetros';
    }
  }

  /**
   * Sanitiza parámetros sensibles (passwords, tokens, etc.)
   */
  private sanitizeParams(params: any): any {
    if (!params || typeof params !== 'object') return params;

    const sanitized = { ...params };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '***REDACTED***';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeParams(sanitized[key]);
      }
    }

    return sanitized;
  }

  /**
   * Formatea errores para logging
   */
  private formatError(error: any): string {
    if (!error) return 'Unknown error';

    if (typeof error === 'string') return error;

    if (error.message) {
      const details = error.code ? ` (Code: ${error.code})` : '';
      return `${error.message}${details}`;
    }

    if (error.error) {
      return this.formatError(error.error);
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  /**
   * Obtiene un resumen del resultado de la query
   */
  private getResultSummary(result: any): string | null {
    try {
      if (!result) return null;

      // Si es un array, mostrar el count
      if (Array.isArray(result)) {
        return `${result.length} registro(s)`;
      }

      // Si tiene data que es array
      if (result.data && Array.isArray(result.data)) {
        return `${result.data.length} registro(s)`;
      }

      // Si es un objeto con id (registro único)
      if (result.id) {
        return `Registro: ${result.id}`;
      }

      // Si tiene user (operaciones de auth)
      if (result.user) {
        return `Usuario: ${result.user.email || result.user.id}`;
      }

      return 'Operación completada';
    } catch {
      return null;
    }
  }

  /**
   * Enmascara email para logging (privacidad)
   */
  private maskEmail(email: string): string {
    if (!email || !email.includes('@')) return 'unknown';

    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `***@${domain}`;
    }

    const visiblePart = localPart.substring(0, 3);
    return `${visiblePart}***@${domain}`;
  }

  /**
   * Formatea la duración en un formato legible
   */
  formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  /**
   * Crea un log estructurado para análisis
   */
  createStructuredLog(log: QueryLog): string {
    const {
      operation,
      table,
      method,
      timestamp,
      duration,
      error,
      userId,
    } = log;

    const logData = {
      timestamp: timestamp.toISOString(),
      operation,
      table: table || 'N/A',
      method,
      duration: duration ? `${duration}ms` : 'N/A',
      status: error ? 'ERROR' : 'SUCCESS',
      userId: userId || 'anonymous',
    };

    return JSON.stringify(logData);
  }
}
