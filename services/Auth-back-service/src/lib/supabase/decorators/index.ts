// src/lib/supabase/decorators/index.ts

/**
 * Exportaciones principales del patrón Decorator para Supabase
 */

// Interfaces y tipos
export type {
  ISupabaseClient,
  OperationMetadata,
} from './supabase-client.interface';

export {
  DatabaseOperation,
  AuthOperation,
} from './supabase-client.interface';

// Wrapper básico
export { SupabaseClientWrapper } from './supabase-client-wrapper';

// Decorator de logging
export { SupabaseLoggingDecorator } from './supabase-logging.decorator';
