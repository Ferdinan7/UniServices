// src/lib/supabase/decorators/supabase-client.interface.ts
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Interfaz base para el cliente de Supabase
 * Define el contrato que deben cumplir tanto el cliente real
 * como los decoradores que lo envuelven
 */
export interface ISupabaseClient {
  /**
   * Obtiene el cliente original de Supabase
   */
  getClient(): SupabaseClient;

  /**
   * Ejecuta una operación SELECT en una tabla
   */
  select(table: string, columns?: string): Promise<any>;

  /**
   * Ejecuta una operación INSERT en una tabla
   */
  insert(table: string, data: any | any[]): Promise<any>;

  /**
   * Ejecuta una operación UPDATE en una tabla
   */
  update(table: string, data: any): Promise<any>;

  /**
   * Ejecuta una operación DELETE en una tabla
   */
  delete(table: string): Promise<any>;

  /**
   * Ejecuta una operación UPSERT en una tabla
   */
  upsert(table: string, data: any | any[]): Promise<any>;

  /**
   * Obtiene referencia a una tabla para operaciones encadenadas
   */
  from(table: string): any;

  /**
   * Acceso a operaciones de autenticación
   */
  auth: {
    signUp(credentials: { email: string; password: string }): Promise<any>;
    signInWithPassword(credentials: { email: string; password: string }): Promise<any>;
    signOut(): Promise<any>;
    getUser(jwt?: string): Promise<any>;
    refreshSession(refreshToken?: { refresh_token: string }): Promise<any>;
  };

  /**
   * Ejecuta una función RPC
   */
  rpc(functionName: string, params?: any): Promise<any>;
}

/**
 * Tipo para operaciones de base de datos
 */
export enum DatabaseOperation {
  SELECT = 'SELECT',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  UPSERT = 'UPSERT',
  RPC = 'RPC',
}

/**
 * Tipo para operaciones de autenticación
 */
export enum AuthOperation {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  GET_USER = 'GET_USER',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  VERIFY_TOKEN = 'VERIFY_TOKEN',
}

/**
 * Metadata de una operación para logging
 */
export interface OperationMetadata {
  operation: string;
  table?: string;
  params?: any;
  timestamp: Date;
  userId?: string;
}
