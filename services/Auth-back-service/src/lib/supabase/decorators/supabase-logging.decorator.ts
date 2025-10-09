// src/lib/supabase/decorators/supabase-logging.decorator.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { ISupabaseClient, DatabaseOperation, AuthOperation } from './supabase-client.interface';
import { SupabaseLoggerService } from '../../logger/supabase-logger.service';

/**
 * Decorator que agrega logging a todas las operaciones de Supabase
 * Implementa el patrón Decorator envolviendo otro ISupabaseClient
 * y agregando logging antes, durante y después de cada operación
 */
export class SupabaseLoggingDecorator implements ISupabaseClient {
  constructor(
    private readonly wrappedClient: ISupabaseClient,
    private readonly logger: SupabaseLoggerService,
  ) {}

  /**
   * Retorna el cliente original de Supabase
   */
  getClient(): SupabaseClient {
    return this.wrappedClient.getClient();
  }

  /**
   * SELECT con logging
   */
  async select(table: string, columns: string = '*'): Promise<any> {
    return this.executeWithLogging(
      DatabaseOperation.SELECT,
      table,
      { columns },
      () => this.wrappedClient.select(table, columns),
    );
  }

  /**
   * INSERT con logging
   */
  async insert(table: string, data: any | any[]): Promise<any> {
    return this.executeWithLogging(
      DatabaseOperation.INSERT,
      table,
      { rowCount: Array.isArray(data) ? data.length : 1 },
      () => this.wrappedClient.insert(table, data),
    );
  }

  /**
   * UPDATE con logging
   */
  async update(table: string, data: any): Promise<any> {
    return this.executeWithLogging(
      DatabaseOperation.UPDATE,
      table,
      { fields: Object.keys(data) },
      () => this.wrappedClient.update(table, data),
    );
  }

  /**
   * DELETE con logging
   */
  async delete(table: string): Promise<any> {
    return this.executeWithLogging(
      DatabaseOperation.DELETE,
      table,
      {},
      () => this.wrappedClient.delete(table),
    );
  }

  /**
   * UPSERT con logging
   */
  async upsert(table: string, data: any | any[]): Promise<any> {
    return this.executeWithLogging(
      DatabaseOperation.UPSERT,
      table,
      { rowCount: Array.isArray(data) ? data.length : 1 },
      () => this.wrappedClient.upsert(table, data),
    );
  }

  /**
   * FROM con logging wrapper
   * Retorna un proxy que intercepta las operaciones encadenadas
   */
  from(table: string): any {
    const builder = this.wrappedClient.from(table);
    return this.createQueryBuilderProxy(builder, table);
  }

  /**
   * RPC con logging
   */
  async rpc(functionName: string, params?: any): Promise<any> {
    return this.executeWithLogging(
      DatabaseOperation.RPC,
      undefined,
      { function: functionName, params },
      () => this.wrappedClient.rpc(functionName, params),
    );
  }

  /**
   * Operaciones de autenticación con logging especializado
   */
  get auth() {
    return {
      signUp: async (credentials: { email: string; password: string }) => {
        return this.executeAuthWithLogging(
          AuthOperation.SIGN_UP,
          credentials.email,
          () => this.wrappedClient.auth.signUp(credentials),
        );
      },

      signInWithPassword: async (credentials: { email: string; password: string }) => {
        return this.executeAuthWithLogging(
          AuthOperation.SIGN_IN,
          credentials.email,
          () => this.wrappedClient.auth.signInWithPassword(credentials),
        );
      },

      signOut: async () => {
        return this.executeAuthWithLogging(
          AuthOperation.SIGN_OUT,
          undefined,
          () => this.wrappedClient.auth.signOut(),
        );
      },

      getUser: async (jwt?: string) => {
        return this.executeAuthWithLogging(
          AuthOperation.GET_USER,
          undefined,
          () => this.wrappedClient.auth.getUser(jwt),
        );
      },

      refreshSession: async (refreshToken?: { refresh_token: string }) => {
        return this.executeAuthWithLogging(
          AuthOperation.REFRESH_TOKEN,
          undefined,
          () => this.wrappedClient.auth.refreshSession(refreshToken),
        );
      },
    };
  }

  // ==================== Métodos Privados de Logging ====================

  /**
   * Ejecuta una operación de base de datos con logging completo
   */
  private async executeWithLogging<T>(
    operation: DatabaseOperation,
    table: string | undefined,
    params: any,
    fn: () => Promise<T>,
  ): Promise<T> {
    const startTime = Date.now();

    // Log de inicio
    this.logger.logQueryStart(operation, table, params);

    try {
      // Ejecutar la operación
      const result = await fn();
      const duration = Date.now() - startTime;

      // Log de éxito
      this.logger.logQuerySuccess(operation, table, duration, result);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log de error
      this.logger.logQueryError(operation, table, duration, error, params);

      // Re-lanzar el error
      throw error;
    }
  }

  /**
   * Ejecuta una operación de autenticación con logging especializado
   */
  private async executeAuthWithLogging<T>(
    operation: AuthOperation,
    email: string | undefined,
    fn: () => Promise<T>,
  ): Promise<T> {
    const startTime = Date.now();

    this.logger.info(`🔐 Iniciando ${operation}`, email ? { email } : undefined);

    try {
      const result = await fn();
      const duration = Date.now() - startTime;

      this.logger.logAuthOperation(operation, email, true);
      this.logger.debug(`Duración: ${duration}ms`);

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;

      this.logger.logAuthOperation(operation, email, false, error);
      this.logger.error(`Duración: ${duration}ms`);

      throw error;
    }
  }

  /**
   * Crea un proxy para el query builder que intercepta llamadas
   * y agrega logging cuando se ejecuta la query final
   */
  private createQueryBuilderProxy(builder: any, table: string): any {
    const self = this;
    let operation = 'SELECT'; // Por defecto
    let queryParams: any = {};

    // Métodos que cambian el tipo de operación
    const operationMethods = ['select', 'insert', 'update', 'delete', 'upsert'];

    // Métodos que ejecutan la query
    const executionMethods = ['then', 'execute'];

    return new Proxy(builder, {
      get(target: any, prop: string) {
        const originalMethod = target[prop];

        // Si no es una función, retornar el valor original
        if (typeof originalMethod !== 'function') {
          return originalMethod;
        }

        // Interceptar métodos de operación
        if (operationMethods.includes(prop)) {
          return function (...args: any[]) {
            operation = prop.toUpperCase();
            queryParams = { method: prop, args: args.length };

            // Ejecutar el método original y retornar el proxy
            const result = originalMethod.apply(target, args);
            return self.createQueryBuilderProxy(result, table);
          };
        }

        // Interceptar métodos de filtro/modificación
        if (['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'is', 'filter', 'order', 'limit', 'single', 'maybeSingle'].includes(prop)) {
          return function (...args: any[]) {
            // Registrar el filtro
            if (!queryParams.filters) queryParams.filters = [];
            queryParams.filters.push({ method: prop, args });

            // Ejecutar el método original y retornar el proxy
            const result = originalMethod.apply(target, args);
            return self.createQueryBuilderProxy(result, table);
          };
        }

        // Interceptar ejecución de la query
        if (executionMethods.includes(prop) || prop === 'then') {
          return async function (...args: any[]) {
            const startTime = Date.now();

            // Log de inicio
            self.logger.logQueryStart(operation, table, queryParams);

            try {
              // Ejecutar la query
              const result = await originalMethod.apply(target, args);
              const duration = Date.now() - startTime;

              // Log de éxito
              const data = result?.data || result;
              self.logger.logQuerySuccess(operation, table, duration, data);

              return result;
            } catch (error) {
              const duration = Date.now() - startTime;

              // Log de error
              self.logger.logQueryError(operation, table, duration, error, queryParams);

              throw error;
            }
          };
        }

        // Para otros métodos, retornar el método original con proxy
        return function (...args: any[]) {
          const result = originalMethod.apply(target, args);

          // Si el resultado es un objeto (query builder), envolver en proxy
          if (result && typeof result === 'object' && result.then) {
            return self.createQueryBuilderProxy(result, table);
          }

          return result;
        };
      },
    });
  }
}
