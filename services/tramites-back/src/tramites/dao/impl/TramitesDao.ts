// src/tramites/dao/impl/TramitesDao.ts

import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../../config/supabase.service';
import { ITramitesDao, TramiteSearchCriteria, TramiteFilterOptions } from '../ITramitesDao';
import { Tramite } from '../../tramites.entity';
import { TramiteGroup } from '../../dto/tramite-group.dto';
import { PaginatedResult, PaginationOptions } from '../IGenericDao';

/**
 * Implementación concreta del DAO de Tramites usando Supabase
 *
 * Esta clase implementa el patrón DAO (Data Access Object) para encapsular
 * toda la lógica de acceso a datos de la entidad Tramite.
 *
 * Ventajas de esta implementación:
 * - Separa la lógica de acceso a datos de la lógica de negocio
 * - Facilita el cambio de base de datos sin afectar el resto del código
 * - Permite testing con mocks fácilmente
 * - Centraliza todas las queries en un solo lugar
 * - Manejo consistente de errores
 */
@Injectable()
export class TramitesDao implements ITramitesDao {
  private readonly logger = new Logger(TramitesDao.name);
  private readonly TABLE_NAME = 'tramites';

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Encuentra todos los trámites
   */
  async findAll(): Promise<Tramite[]> {
    try {
      this.logger.debug('Ejecutando findAll()');

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error en findAll: ${error.message}`, error);
        throw new Error(`Error al obtener trámites: ${error.message}`);
      }

      this.logger.debug(`findAll() retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error('Error inesperado en findAll', error);
      throw error;
    }
  }

  /**
   * Encuentra un trámite por ID
   */
  async findById(id: number | string): Promise<Tramite | null> {
    try {
      this.logger.debug(`Ejecutando findById(${id})`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró el registro
          this.logger.debug(`Trámite con id ${id} no encontrado`);
          return null;
        }
        this.logger.error(`Error en findById(${id}): ${error.message}`, error);
        throw new Error(`Error al buscar trámite: ${error.message}`);
      }

      this.logger.debug(`findById(${id}) retornó un registro`);
      return data as Tramite;
    } catch (error) {
      this.logger.error(`Error inesperado en findById(${id})`, error);
      throw error;
    }
  }

  /**
   * Encuentra trámites por criterio
   */
  async findBy(criteria: Partial<Tramite>): Promise<Tramite[]> {
    try {
      this.logger.debug(`Ejecutando findBy con criterios: ${JSON.stringify(criteria)}`);

      let query = this.supabase.client.from(this.TABLE_NAME).select('*');

      // Aplicar cada criterio
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error en findBy: ${error.message}`, error);
        throw new Error(`Error al buscar trámites: ${error.message}`);
      }

      this.logger.debug(`findBy() retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error('Error inesperado en findBy', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo trámite
   */
  async create(entity: Omit<Tramite, 'id' | 'created_at'>): Promise<Tramite> {
    try {
      this.logger.debug(`Ejecutando create con: ${JSON.stringify(entity)}`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .insert(entity)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error en create: ${error.message}`, error);
        throw new Error(`Error al crear trámite: ${error.message}`);
      }

      this.logger.debug(`create() creó el registro con id: ${data.id}`);
      return data as Tramite;
    } catch (error) {
      this.logger.error('Error inesperado en create', error);
      throw error;
    }
  }

  /**
   * Actualiza un trámite existente
   */
  async update(id: number | string, entity: Partial<Tramite>): Promise<Tramite> {
    try {
      this.logger.debug(`Ejecutando update(${id}) con: ${JSON.stringify(entity)}`);

      // Verificar que existe
      const exists = await this.exists(id);
      if (!exists) {
        throw new Error(`Trámite con id ${id} no encontrado`);
      }

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .update(entity)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error en update(${id}): ${error.message}`, error);
        throw new Error(`Error al actualizar trámite: ${error.message}`);
      }

      this.logger.debug(`update(${id}) actualizó el registro exitosamente`);
      return data as Tramite;
    } catch (error) {
      this.logger.error(`Error inesperado en update(${id})`, error);
      throw error;
    }
  }

  /**
   * Elimina un trámite
   */
  async delete(id: number | string): Promise<void> {
    try {
      this.logger.debug(`Ejecutando delete(${id})`);

      // Verificar que existe
      const exists = await this.exists(id);
      if (!exists) {
        throw new Error(`Trámite con id ${id} no encontrado`);
      }

      const { error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error en delete(${id}): ${error.message}`, error);
        throw new Error(`Error al eliminar trámite: ${error.message}`);
      }

      this.logger.debug(`delete(${id}) eliminó el registro exitosamente`);
    } catch (error) {
      this.logger.error(`Error inesperado en delete(${id})`, error);
      throw error;
    }
  }

  /**
   * Cuenta el total de trámites
   */
  async count(): Promise<number> {
    try {
      this.logger.debug('Ejecutando count()');

      const { count, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*', { count: 'exact', head: true });

      if (error) {
        this.logger.error(`Error en count: ${error.message}`, error);
        throw new Error(`Error al contar trámites: ${error.message}`);
      }

      this.logger.debug(`count() retornó: ${count}`);
      return count || 0;
    } catch (error) {
      this.logger.error('Error inesperado en count', error);
      throw error;
    }
  }

  /**
   * Verifica si existe un trámite con el ID dado
   */
  async exists(id: number | string): Promise<boolean> {
    try {
      this.logger.debug(`Ejecutando exists(${id})`);

      const { count, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('id', { count: 'exact', head: true })
        .eq('id', id);

      if (error) {
        this.logger.error(`Error en exists(${id}): ${error.message}`, error);
        throw new Error(`Error al verificar existencia: ${error.message}`);
      }

      const exists = (count || 0) > 0;
      this.logger.debug(`exists(${id}) retornó: ${exists}`);
      return exists;
    } catch (error) {
      this.logger.error(`Error inesperado en exists(${id})`, error);
      throw error;
    }
  }

  // ==================== Métodos Específicos de Tramites ====================

  /**
   * Encuentra todos los trámites agrupados por categoría
   */
  async findAllGrouped(): Promise<TramiteGroup[]> {
    try {
      this.logger.debug('Ejecutando findAllGrouped()');

      // Obtener todos los trámites
      const tramites = await this.findAll();

      // Agrupar por categoría
      const groupedMap = tramites.reduce((acc: Record<string, Tramite[]>, tramite: Tramite) => {
        if (!acc[tramite.category]) {
          acc[tramite.category] = [];
        }
        acc[tramite.category].push(tramite);
        return acc;
      }, {});

      // Convertir a array de TramiteGroup
      const grouped = Object.entries(groupedMap).map(([category, tramites]) => ({
        category,
        tramites,
      })) as TramiteGroup[];

      this.logger.debug(`findAllGrouped() retornó ${grouped.length} grupos`);
      return grouped;
    } catch (error) {
      this.logger.error('Error inesperado en findAllGrouped', error);
      throw error;
    }
  }

  /**
   * Encuentra trámites por categoría
   */
  async findByCategory(category: string): Promise<Tramite[]> {
    try {
      this.logger.debug(`Ejecutando findByCategory("${category}")`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .eq('category', category)
        .order('title', { ascending: true });

      if (error) {
        this.logger.error(`Error en findByCategory: ${error.message}`, error);
        throw new Error(`Error al buscar trámites por categoría: ${error.message}`);
      }

      this.logger.debug(`findByCategory("${category}") retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error(`Error inesperado en findByCategory("${category}")`, error);
      throw error;
    }
  }

  /**
   * Busca trámites por título
   */
  async searchByTitle(searchTerm: string): Promise<Tramite[]> {
    try {
      this.logger.debug(`Ejecutando searchByTitle("${searchTerm}")`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .ilike('title', `%${searchTerm}%`)
        .order('title', { ascending: true });

      if (error) {
        this.logger.error(`Error en searchByTitle: ${error.message}`, error);
        throw new Error(`Error al buscar por título: ${error.message}`);
      }

      this.logger.debug(`searchByTitle("${searchTerm}") retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error(`Error inesperado en searchByTitle("${searchTerm}")`, error);
      throw error;
    }
  }

  /**
   * Busca trámites por descripción
   */
  async searchByDescription(searchTerm: string): Promise<Tramite[]> {
    try {
      this.logger.debug(`Ejecutando searchByDescription("${searchTerm}")`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .ilike('description', `%${searchTerm}%`)
        .order('title', { ascending: true });

      if (error) {
        this.logger.error(`Error en searchByDescription: ${error.message}`, error);
        throw new Error(`Error al buscar por descripción: ${error.message}`);
      }

      this.logger.debug(`searchByDescription("${searchTerm}") retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error(`Error inesperado en searchByDescription("${searchTerm}")`, error);
      throw error;
    }
  }

  /**
   * Búsqueda global en título, descripción y categoría
   */
  async globalSearch(searchTerm: string): Promise<Tramite[]> {
    try {
      this.logger.debug(`Ejecutando globalSearch("${searchTerm}")`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .order('title', { ascending: true });

      if (error) {
        this.logger.error(`Error en globalSearch: ${error.message}`, error);
        throw new Error(`Error en búsqueda global: ${error.message}`);
      }

      this.logger.debug(`globalSearch("${searchTerm}") retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error(`Error inesperado en globalSearch("${searchTerm}")`, error);
      throw error;
    }
  }

  /**
   * Obtiene todas las categorías únicas
   */
  async findAllCategories(): Promise<string[]> {
    try {
      this.logger.debug('Ejecutando findAllCategories()');

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('category');

      if (error) {
        this.logger.error(`Error en findAllCategories: ${error.message}`, error);
        throw new Error(`Error al obtener categorías: ${error.message}`);
      }

      // Extraer categorías únicas
      const categories = [...new Set(data.map(item => item.category))].sort();

      this.logger.debug(`findAllCategories() retornó ${categories.length} categorías`);
      return categories;
    } catch (error) {
      this.logger.error('Error inesperado en findAllCategories', error);
      throw error;
    }
  }

  /**
   * Cuenta trámites por categoría
   */
  async countByCategory(): Promise<Record<string, number>> {
    try {
      this.logger.debug('Ejecutando countByCategory()');

      const tramites = await this.findAll();

      const counts = tramites.reduce((acc: Record<string, number>, tramite) => {
        acc[tramite.category] = (acc[tramite.category] || 0) + 1;
        return acc;
      }, {});

      this.logger.debug(`countByCategory() retornó conteos para ${Object.keys(counts).length} categorías`);
      return counts;
    } catch (error) {
      this.logger.error('Error inesperado en countByCategory', error);
      throw error;
    }
  }

  /**
   * Encuentra trámites más recientes
   */
  async findRecent(limit: number = 10): Promise<Tramite[]> {
    try {
      this.logger.debug(`Ejecutando findRecent(${limit})`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        this.logger.error(`Error en findRecent: ${error.message}`, error);
        throw new Error(`Error al obtener trámites recientes: ${error.message}`);
      }

      this.logger.debug(`findRecent(${limit}) retornó ${data?.length || 0} registros`);
      return data as Tramite[];
    } catch (error) {
      this.logger.error(`Error inesperado en findRecent(${limit})`, error);
      throw error;
    }
  }

  /**
   * Verifica si existe un trámite con el título dado
   */
  async existsByTitle(title: string): Promise<boolean> {
    try {
      this.logger.debug(`Ejecutando existsByTitle("${title}")`);

      const { count, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('id', { count: 'exact', head: true })
        .eq('title', title);

      if (error) {
        this.logger.error(`Error en existsByTitle: ${error.message}`, error);
        throw new Error(`Error al verificar existencia por título: ${error.message}`);
      }

      const exists = (count || 0) > 0;
      this.logger.debug(`existsByTitle("${title}") retornó: ${exists}`);
      return exists;
    } catch (error) {
      this.logger.error(`Error inesperado en existsByTitle("${title}")`, error);
      throw error;
    }
  }

  /**
   * Actualiza múltiples trámites de una categoría
   */
  async updateByCategory(category: string, updates: Partial<Tramite>): Promise<number> {
    try {
      this.logger.debug(`Ejecutando updateByCategory("${category}")`);

      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .update(updates)
        .eq('category', category)
        .select('id');

      if (error) {
        this.logger.error(`Error en updateByCategory: ${error.message}`, error);
        throw new Error(`Error al actualizar por categoría: ${error.message}`);
      }

      const count = data?.length || 0;
      this.logger.debug(`updateByCategory("${category}") actualizó ${count} registros`);
      return count;
    } catch (error) {
      this.logger.error(`Error inesperado en updateByCategory("${category}")`, error);
      throw error;
    }
  }

  /**
   * Elimina todos los trámites de una categoría
   */
  async deleteByCategory(category: string): Promise<number> {
    try {
      this.logger.debug(`Ejecutando deleteByCategory("${category}")`);

      // Primero contar cuántos se eliminarán
      const tramites = await this.findByCategory(category);
      const count = tramites.length;

      if (count === 0) {
        this.logger.debug(`deleteByCategory("${category}"): No hay registros para eliminar`);
        return 0;
      }

      const { error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .delete()
        .eq('category', category);

      if (error) {
        this.logger.error(`Error en deleteByCategory: ${error.message}`, error);
        throw new Error(`Error al eliminar por categoría: ${error.message}`);
      }

      this.logger.debug(`deleteByCategory("${category}") eliminó ${count} registros`);
      return count;
    } catch (error) {
      this.logger.error(`Error inesperado en deleteByCategory("${category}")`, error);
      throw error;
    }
  }

  /**
   * Encuentra registros con paginación
   */
  async findAllPaginated(options: PaginationOptions): Promise<PaginatedResult<Tramite>> {
    try {
      this.logger.debug(`Ejecutando findAllPaginated con opciones: ${JSON.stringify(options)}`);

      const { page, limit, orderBy = 'created_at', orderDirection = 'desc' } = options;
      const offset = (page - 1) * limit;

      // Obtener total de registros
      const total = await this.count();

      // Obtener registros paginados
      const { data, error } = await this.supabase.client
        .from(this.TABLE_NAME)
        .select('*')
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) {
        this.logger.error(`Error en findAllPaginated: ${error.message}`, error);
        throw new Error(`Error al obtener trámites paginados: ${error.message}`);
      }

      const totalPages = Math.ceil(total / limit);

      const result: PaginatedResult<Tramite> = {
        data: data as Tramite[],
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };

      this.logger.debug(`findAllPaginated retornó ${data?.length || 0} de ${total} registros`);
      return result;
    } catch (error) {
      this.logger.error('Error inesperado en findAllPaginated', error);
      throw error;
    }
  }
}
