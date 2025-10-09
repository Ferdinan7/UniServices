// src/strategies/index.ts

/**
 * Exportaciones del patrón Strategy para autenticación
 *
 * Este módulo exporta todas las estrategias de autenticación disponibles
 * y los tipos relacionados.
 */

// Interfaz Strategy y tipos
export {
  IAuthStrategy,
  AuthCredentials,
  AuthResult,
  AuthStrategyRegistry,
  AuthenticationError,
} from './IAuthStrategy';

// Estrategias concretas
export { EmailPasswordStrategy } from './EmailPasswordStrategy';
export { GoogleOAuthStrategy } from './GoogleOAuthStrategy';
