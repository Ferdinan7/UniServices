// src/tramites/dao/index.ts

/**
 * Exportaciones del patrón DAO (Data Access Object)
 *
 * Este módulo exporta todas las interfaces y implementaciones
 * del patrón DAO para el módulo de trámites.
 */

// Interfaces base genéricas
export type {
  IGenericDao,
  IPaginableDao,
  PaginationOptions,
  PaginatedResult,
} from './IGenericDao';

// Interface DAO específica de Tramites
export type {
  ITramitesDao,
  TramiteSearchCriteria,
  TramiteFilterOptions,
} from './ITramitesDao';

// Implementación concreta
export { TramitesDao } from './impl/TramitesDao';
