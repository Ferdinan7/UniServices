// src/lib/supabase/decorators/supabase-client-wrapper.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { ISupabaseClient } from './supabase-client.interface';

/**
 * Wrapper básico del cliente de Supabase
 * Implementa ISupabaseClient y delega todas las operaciones al cliente real
 * Esta es la implementación base que los decoradores envolverán
 */
export class SupabaseClientWrapper implements ISupabaseClient {
  constructor(protected readonly client: SupabaseClient) {}

  /**
   * Retorna el cliente original de Supabase
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Ejecuta una operación SELECT en una tabla
   */
  async select(table: string, columns: string = '*'): Promise<any> {
    const { data, error } = await this.client
      .from(table)
      .select(columns);

    if (error) throw error;
    return data;
  }

  /**
   * Ejecuta una operación INSERT en una tabla
   */
  async insert(table: string, data: any | any[]): Promise<any> {
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select();

    if (error) throw error;
    return result;
  }

  /**
   * Ejecuta una operación UPDATE en una tabla
   */
  async update(table: string, data: any): Promise<any> {
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .select();

    if (error) throw error;
    return result;
  }

  /**
   * Ejecuta una operación DELETE en una tabla
   */
  async delete(table: string): Promise<any> {
    const { data, error } = await this.client
      .from(table)
      .delete()
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Ejecuta una operación UPSERT en una tabla
   */
  async upsert(table: string, data: any | any[]): Promise<any> {
    const { data: result, error } = await this.client
      .from(table)
      .upsert(data)
      .select();

    if (error) throw error;
    return result;
  }

  /**
   * Obtiene referencia a una tabla para operaciones encadenadas
   * Esta es la forma más común de usar Supabase
   */
  from(table: string): any {
    return this.client.from(table);
  }

  /**
   * Ejecuta una función RPC (Remote Procedure Call)
   */
  async rpc(functionName: string, params?: any): Promise<any> {
    const { data, error } = await this.client.rpc(functionName, params);

    if (error) throw error;
    return data;
  }

  /**
   * Operaciones de autenticación
   * Delega directamente al cliente de Supabase
   */
  get auth() {
    return {
      signUp: async (credentials: { email: string; password: string }) => {
        return await this.client.auth.signUp(credentials);
      },

      signInWithPassword: async (credentials: { email: string; password: string }) => {
        return await this.client.auth.signInWithPassword(credentials);
      },

      signOut: async () => {
        return await this.client.auth.signOut();
      },

      getUser: async (jwt?: string) => {
        return await this.client.auth.getUser(jwt);
      },

      refreshSession: async (refreshToken?: { refresh_token: string }) => {
        return await this.client.auth.refreshSession(refreshToken);
      },
    };
  }
}
