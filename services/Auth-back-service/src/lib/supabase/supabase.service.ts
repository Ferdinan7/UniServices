// src/lib/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ISupabaseClient } from './decorators/supabase-client.interface';
import { SupabaseClientWrapper } from './decorators/supabase-client-wrapper';
import { SupabaseLoggingDecorator } from './decorators/supabase-logging.decorator';
import { SupabaseLoggerService } from '../logger/supabase-logger.service';

/**
 * Servicio principal de Supabase que implementa el patrón Decorator
 *
 * Estructura del patrón:
 * 1. SupabaseClient (Cliente real de Supabase)
 * 2. SupabaseClientWrapper (Wrapper básico que implementa ISupabaseClient)
 * 3. SupabaseLoggingDecorator (Decorator que agrega logging)
 *
 * Ventajas:
 * - Logging transparente sin modificar código existente
 * - Fácil agregar más decorators (caching, metrics, retry, etc.)
 * - Se puede activar/desactivar el logging con variables de entorno
 * - Mantiene la interfaz original de Supabase
 */
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private client: ISupabaseClient;
  private readonly logger: SupabaseLoggerService;
  private readonly enableLogging: boolean;

  constructor() {
    // Inicializar logger
    this.logger = new SupabaseLoggerService();

    // Verificar si el logging está habilitado
    this.enableLogging = process.env.SUPABASE_LOGGING_ENABLED !== 'false';

    // Crear el cliente real de Supabase
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );

    // Log de inicialización
    this.logger.info('🚀 Inicializando SupabaseService', {
      url: process.env.SUPABASE_URL,
      loggingEnabled: this.enableLogging,
    });

    // Aplicar el patrón Decorator
    this.client = this.createDecoratedClient();

    this.logger.info('✅ SupabaseService inicializado correctamente');
  }

  /**
   * Crea el cliente decorado con logging
   * Si el logging está deshabilitado, retorna solo el wrapper básico
   */
  private createDecoratedClient(): ISupabaseClient {
    // 1. Crear el wrapper básico
    const wrapper = new SupabaseClientWrapper(this.supabase);

    // 2. Si el logging está habilitado, envolver con el decorator de logging
    if (this.enableLogging) {
      return new SupabaseLoggingDecorator(wrapper, this.logger);
    }

    // 3. Si no, retornar solo el wrapper (sin logging)
    return wrapper;
  }

  /**
   * Retorna el cliente de Supabase (decorado o sin decorar)
   * Este método mantiene la compatibilidad con código existente
   */
  getClient(): SupabaseClient {
    return this.client.getClient();
  }

  /**
   * Retorna el cliente decorado con todas las operaciones loggeadas
   * Usar este método para aprovechar el sistema de logging
   */
  getDecoratedClient(): ISupabaseClient {
    return this.client;
  }

  /**
   * Shortcut para operaciones SELECT
   * @example
   * const users = await supabaseService.select('users');
   * const user = await supabaseService.select('users', 'id, email');
   */
  async select(table: string, columns: string = '*'): Promise<any> {
    return this.client.select(table, columns);
  }

  /**
   * Shortcut para operaciones INSERT
   * @example
   * const newUser = await supabaseService.insert('users', { email: 'test@example.com' });
   */
  async insert(table: string, data: any): Promise<any> {
    return this.client.insert(table, data);
  }

  /**
   * Shortcut para operaciones UPDATE
   * @example
   * const updated = await supabaseService.update('users', { name: 'John' });
   */
  async update(table: string, data: any): Promise<any> {
    return this.client.update(table, data);
  }

  /**
   * Shortcut para operaciones DELETE
   * @example
   * const deleted = await supabaseService.delete('users');
   */
  async delete(table: string): Promise<any> {
    return this.client.delete(table);
  }

  /**
   * Shortcut para operaciones UPSERT
   * @example
   * const upserted = await supabaseService.upsert('users', { id: 1, name: 'John' });
   */
  async upsert(table: string, data: any): Promise<any> {
    return this.client.upsert(table, data);
  }

  /**
   * Acceso a operaciones de tabla con query builder
   * Esta es la forma más común de usar Supabase
   * @example
   * const { data, error } = await supabaseService
   *   .from('users')
   *   .select('*')
   *   .eq('id', 1)
   *   .single();
   */
  from(table: string): any {
    return this.client.from(table);
  }

  /**
   * Ejecuta una función RPC
   * @example
   * const result = await supabaseService.rpc('my_function', { param1: 'value' });
   */
  async rpc(functionName: string, params?: any): Promise<any> {
    return this.client.rpc(functionName, params);
  }

  /**
   * Acceso a operaciones de autenticación (con logging automático)
   */
  get auth() {
    return this.client.auth;
  }

  /**
   * Obtiene el logger para logging personalizado
   */
  getLogger(): SupabaseLoggerService {
    return this.logger;
  }

  /**
   * Habilita o deshabilita el logging dinámicamente
   * Nota: Requiere recrear el cliente decorado
   */
  setLoggingEnabled(enabled: boolean): void {
    if (enabled !== this.enableLogging) {
      // Recrear el cliente con la nueva configuración
      process.env.SUPABASE_LOGGING_ENABLED = enabled ? 'true' : 'false';
      this.client = this.createDecoratedClient();

      this.logger.info(`Logging ${enabled ? 'habilitado' : 'deshabilitado'}`);
    }
  }
}
