// src/tramites/dao/ITramitesDao.ts

import { IGenericDao } from './IGenericDao';
import { Tramite } from '../tramites.entity';
import { TramiteGroup } from '../dto/tramite-group.dto';

/**
 * Interfaz DAO específica para Tramites
 *
 * Extiende IGenericDao con operaciones específicas del dominio de trámites.
 * Define métodos de acceso a datos especializados que van más allá de las
 * operaciones CRUD básicas.
 *
 * Patrón DAO aplicado:
 * - Abstrae el acceso a la base de datos de trámites
 * - Permite cambiar la implementación sin afectar la lógica de negocio
 * - Facilita testing con mocks
 */
export interface ITramitesDao extends IGenericDao<Tramite> {
  /**
   * Encuentra todos los trámites agrupados por categoría
   *
   * @returns Promise con array de grupos, cada uno con su categoría y trámites
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const grupos = await tramitesDao.findAllGrouped();
   * // Resultado: [{ category: "Académicos", tramites: [...] }, ...]
   */
  findAllGrouped(): Promise<TramiteGroup[]>;

  /**
   * Encuentra trámites por categoría específica
   *
   * @param category - Nombre de la categoría a buscar
   * @returns Promise con array de trámites de esa categoría
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const academicos = await tramitesDao.findByCategory("Académicos");
   */
  findByCategory(category: string): Promise<Tramite[]>;

  /**
   * Busca trámites por título (búsqueda parcial, case-insensitive)
   *
   * @param searchTerm - Término de búsqueda
   * @returns Promise con array de trámites que coinciden con la búsqueda
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const resultados = await tramitesDao.searchByTitle("certificado");
   */
  searchByTitle(searchTerm: string): Promise<Tramite[]>;

  /**
   * Busca trámites por descripción (búsqueda parcial, case-insensitive)
   *
   * @param searchTerm - Término de búsqueda
   * @returns Promise con array de trámites que coinciden con la búsqueda
   * @throws Error si hay un problema al consultar la base de datos
   */
  searchByDescription(searchTerm: string): Promise<Tramite[]>;

  /**
   * Busca trámites por cualquier campo (título, descripción, categoría)
   *
   * @param searchTerm - Término de búsqueda global
   * @returns Promise con array de trámites que coinciden con la búsqueda
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const resultados = await tramitesDao.globalSearch("inscripción");
   */
  globalSearch(searchTerm: string): Promise<Tramite[]>;

  /**
   * Obtiene todas las categorías únicas disponibles
   *
   * @returns Promise con array de nombres de categorías
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const categorias = await tramitesDao.findAllCategories();
   * // Resultado: ["Académicos", "Administrativos", "Servicios"]
   */
  findAllCategories(): Promise<string[]>;

  /**
   * Cuenta trámites por categoría
   *
   * @returns Promise con objeto que mapea categoría a cantidad
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const conteos = await tramitesDao.countByCategory();
   * // Resultado: { "Académicos": 5, "Administrativos": 3 }
   */
  countByCategory(): Promise<Record<string, number>>;

  /**
   * Encuentra trámites más recientes
   *
   * @param limit - Número máximo de trámites a retornar
   * @returns Promise con array de trámites más recientes
   * @throws Error si hay un problema al consultar la base de datos
   *
   * @example
   * const recientes = await tramitesDao.findRecent(10);
   */
  findRecent(limit: number): Promise<Tramite[]>;

  /**
   * Verifica si existe un trámite con el título dado
   *
   * @param title - Título del trámite
   * @returns Promise<boolean> true si existe, false en caso contrario
   */
  existsByTitle(title: string): Promise<boolean>;

  /**
   * Actualiza múltiples trámites de una categoría
   *
   * @param category - Categoría de los trámites a actualizar
   * @param updates - Campos a actualizar
   * @returns Promise con número de registros actualizados
   * @throws Error si hay un problema al actualizar
   */
  updateByCategory(category: string, updates: Partial<Tramite>): Promise<number>;

  /**
   * Elimina todos los trámites de una categoría
   *
   * @param category - Categoría a eliminar
   * @returns Promise con número de registros eliminados
   * @throws Error si hay un problema al eliminar
   */
  deleteByCategory(category: string): Promise<number>;
}

/**
 * Criterios de búsqueda avanzada para trámites
 */
export interface TramiteSearchCriteria {
  title?: string;
  description?: string;
  category?: string;
  categories?: string[];
  searchTerm?: string; // Búsqueda global
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Opciones de filtrado para consultas de trámites
 */
export interface TramiteFilterOptions {
  categories?: string[];
  searchTerm?: string;
  sortBy?: 'title' | 'category' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
