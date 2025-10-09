// src/tramites/tramites.service.ts

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TramitesDao } from './dao/impl/TramitesDao';
import { Tramite } from './tramites.entity';
import { TramiteGroup } from './dto/tramite-group.dto';
import { PaginationOptions, PaginatedResult } from './dao/IGenericDao';

/**
 * Servicio de Trámites refactorizado usando el patrón DAO
 *
 * Este servicio contiene la lógica de negocio y delega el acceso
 * a datos al DAO (Data Access Object).
 *
 * Ventajas de usar DAO:
 * - Separación clara entre lógica de negocio y acceso a datos
 * - Fácil testing con mocks del DAO
 * - Posibilidad de cambiar la fuente de datos sin afectar la lógica
 * - Código más limpio y mantenible
 *
 * Patrón DAO aplicado:
 * - Service: Contiene lógica de negocio (esta clase)
 * - DAO: Maneja el acceso a datos (TramitesDao)
 * - Entity: Representa el modelo de datos (Tramite)
 */
@Injectable()
export class TramitesService {
  private readonly logger = new Logger(TramitesService.name);

  constructor(private readonly tramitesDao: TramitesDao) {
    this.logger.log('✅ TramitesService inicializado con patrón DAO');
  }

  /**
   * Obtiene todos los trámites
   *
   * @returns Promise con array de todos los trámites
   * @throws Error si hay un problema al consultar la base de datos
   */
  async getAll(): Promise<Tramite[]> {
    try {
      this.logger.debug('🔍 Obteniendo todos los trámites');

      const tramites = await this.tramitesDao.findAll();

      this.logger.log(`✅ Se obtuvieron ${tramites.length} trámites`);
      return tramites;
    } catch (error) {
      this.logger.error('❌ Error al obtener trámites', error);
      throw error;
    }
  }

  /**
   * Obtiene trámites agrupados por categoría
   *
   * @returns Promise con array de grupos de trámites
   * @throws Error si hay un problema al consultar la base de datos
   */
  async findAllGrouped(): Promise<TramiteGroup[]> {
    try {
      this.logger.debug('🔍 Obteniendo trámites agrupados por categoría');

      const grouped = await this.tramitesDao.findAllGrouped();

      this.logger.log(`✅ Se obtuvieron ${grouped.length} grupos de trámites`);
      return grouped;
    } catch (error) {
      this.logger.error('❌ Error al obtener trámites agrupados', error);
      throw error;
    }
  }

  /**
   * Obtiene un trámite por su ID
   *
   * @param id - ID del trámite
   * @returns Promise con el trámite encontrado
   * @throws NotFoundException si el trámite no existe
   */
  async findById(id: number): Promise<Tramite> {
    try {
      this.logger.debug(`🔍 Buscando trámite con id: ${id}`);

      const tramite = await this.tramitesDao.findById(id);

      if (!tramite) {
        this.logger.warn(`⚠️  Trámite con id ${id} no encontrado`);
        throw new NotFoundException(`Trámite con id ${id} no encontrado`);
      }

      this.logger.log(`✅ Trámite encontrado: ${tramite.title}`);
      return tramite;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`❌ Error al buscar trámite con id ${id}`, error);
      throw error;
    }
  }

  /**
   * Obtiene trámites de una categoría específica
   *
   * @param category - Nombre de la categoría
   * @returns Promise con array de trámites de esa categoría
   */
  async findByCategory(category: string): Promise<Tramite[]> {
    try {
      this.logger.debug(`🔍 Buscando trámites de categoría: ${category}`);

      const tramites = await this.tramitesDao.findByCategory(category);

      this.logger.log(
        `✅ Se encontraron ${tramites.length} trámites en categoría "${category}"`,
      );
      return tramites;
    } catch (error) {
      this.logger.error(
        `❌ Error al buscar trámites por categoría "${category}"`,
        error,
      );
      throw error;
    }
  }

  /**
   * Busca trámites por término de búsqueda (búsqueda global)
   *
   * @param searchTerm - Término a buscar en título, descripción y categoría
   * @returns Promise con array de trámites que coinciden
   */
  async search(searchTerm: string): Promise<Tramite[]> {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw new BadRequestException(
          'El término de búsqueda no puede estar vacío',
        );
      }

      this.logger.debug(`🔍 Búsqueda global con término: "${searchTerm}"`);

      const tramites = await this.tramitesDao.globalSearch(searchTerm.trim());

      this.logger.log(
        `✅ Se encontraron ${tramites.length} trámites para "${searchTerm}"`,
      );
      return tramites;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `❌ Error en búsqueda global con término "${searchTerm}"`,
        error,
      );
      throw error;
    }
  }

  /**
   * Busca trámites por título
   *
   * @param title - Término a buscar en el título
   * @returns Promise con array de trámites que coinciden
   */
  async searchByTitle(title: string): Promise<Tramite[]> {
    try {
      if (!title || title.trim().length === 0) {
        throw new BadRequestException(
          'El título de búsqueda no puede estar vacío',
        );
      }

      this.logger.debug(`🔍 Buscando por título: "${title}"`);

      const tramites = await this.tramitesDao.searchByTitle(title.trim());

      this.logger.log(
        `✅ Se encontraron ${tramites.length} trámites con título "${title}"`,
      );
      return tramites;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`❌ Error al buscar por título "${title}"`, error);
      throw error;
    }
  }

  /**
   * Obtiene todas las categorías disponibles
   *
   * @returns Promise con array de nombres de categorías
   */
  async getCategories(): Promise<string[]> {
    try {
      this.logger.debug('🔍 Obteniendo categorías disponibles');

      const categories = await this.tramitesDao.findAllCategories();

      this.logger.log(`✅ Se encontraron ${categories.length} categorías`);
      return categories;
    } catch (error) {
      this.logger.error('❌ Error al obtener categorías', error);
      throw error;
    }
  }

  /**
   * Obtiene el conteo de trámites por categoría
   *
   * @returns Promise con objeto que mapea categoría a cantidad
   */
  async getCountByCategory(): Promise<Record<string, number>> {
    try {
      this.logger.debug('🔍 Obteniendo conteo por categoría');

      const counts = await this.tramitesDao.countByCategory();

      this.logger.log(
        `✅ Conteo obtenido para ${Object.keys(counts).length} categorías`,
      );
      return counts;
    } catch (error) {
      this.logger.error('❌ Error al obtener conteo por categoría', error);
      throw error;
    }
  }

  /**
   * Obtiene los trámites más recientes
   *
   * @param limit - Número máximo de trámites a retornar (default: 10)
   * @returns Promise con array de trámites recientes
   */
  async getRecent(limit: number = 10): Promise<Tramite[]> {
    try {
      if (limit <= 0 || limit > 100) {
        throw new BadRequestException('El límite debe estar entre 1 y 100');
      }

      this.logger.debug(`🔍 Obteniendo ${limit} trámites recientes`);

      const tramites = await this.tramitesDao.findRecent(limit);

      this.logger.log(`✅ Se obtuvieron ${tramites.length} trámites recientes`);
      return tramites;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`❌ Error al obtener trámites recientes`, error);
      throw error;
    }
  }

  /**
   * Obtiene trámites con paginación
   *
   * @param page - Número de página (comenzando en 1)
   * @param limit - Cantidad de registros por página
   * @param orderBy - Campo por el cual ordenar
   * @param orderDirection - Dirección del ordenamiento
   * @returns Promise con resultado paginado
   */
  async getPaginated(
    page: number = 1,
    limit: number = 10,
    orderBy: string = 'created_at',
    orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedResult<Tramite>> {
    try {
      if (page < 1) {
        throw new BadRequestException('El número de página debe ser mayor a 0');
      }

      if (limit < 1 || limit > 100) {
        throw new BadRequestException('El límite debe estar entre 1 y 100');
      }

      this.logger.debug(`🔍 Obteniendo página ${page} con ${limit} registros`);

      const options: PaginationOptions = {
        page,
        limit,
        orderBy,
        orderDirection,
      };

      const result = await this.tramitesDao.findAllPaginated(options);

      this.logger.log(
        `✅ Página ${result.page} de ${result.totalPages} obtenida (${result.data.length} registros)`,
      );
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('❌ Error al obtener trámites paginados', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo trámite
   *
   * @param tramiteData - Datos del trámite a crear
   * @returns Promise con el trámite creado
   */
  async create(
    tramiteData: Omit<Tramite, 'id' | 'created_at'>,
  ): Promise<Tramite> {
    try {
      // Validar datos básicos
      if (!tramiteData.title || tramiteData.title.trim().length === 0) {
        throw new BadRequestException('El título es requerido');
      }

      if (!tramiteData.category || tramiteData.category.trim().length === 0) {
        throw new BadRequestException('La categoría es requerida');
      }

      // Verificar si ya existe un trámite con el mismo título
      const exists = await this.tramitesDao.existsByTitle(tramiteData.title);
      if (exists) {
        throw new BadRequestException(
          `Ya existe un trámite con el título "${tramiteData.title}"`,
        );
      }

      this.logger.debug(`📝 Creando nuevo trámite: ${tramiteData.title}`);

      const tramite = await this.tramitesDao.create(tramiteData);

      this.logger.log(`✅ Trámite creado exitosamente con id: ${tramite.id}`);
      return tramite;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('❌ Error al crear trámite', error);
      throw error;
    }
  }

  /**
   * Actualiza un trámite existente
   *
   * @param id - ID del trámite a actualizar
   * @param updates - Datos a actualizar
   * @returns Promise con el trámite actualizado
   */
  async update(id: number, updates: Partial<Tramite>): Promise<Tramite> {
    try {
      // Verificar que el trámite existe
      const exists = await this.tramitesDao.exists(id);
      if (!exists) {
        throw new NotFoundException(`Trámite con id ${id} no encontrado`);
      }

      // Si se está actualizando el título, verificar que no exista otro con ese título
      if (updates.title) {
        const current = await this.tramitesDao.findById(id);
        if (current && current.title !== updates.title) {
          const titleExists = await this.tramitesDao.existsByTitle(
            updates.title,
          );
          if (titleExists) {
            throw new BadRequestException(
              `Ya existe un trámite con el título "${updates.title}"`,
            );
          }
        }
      }

      this.logger.debug(`✏️  Actualizando trámite con id: ${id}`);

      const tramite = await this.tramitesDao.update(id, updates);

      this.logger.log(`✅ Trámite actualizado exitosamente: ${tramite.title}`);
      return tramite;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`❌ Error al actualizar trámite con id ${id}`, error);
      throw error;
    }
  }

  /**
   * Elimina un trámite
   *
   * @param id - ID del trámite a eliminar
   */
  async delete(id: number): Promise<void> {
    try {
      // Verificar que el trámite existe
      const tramite = await this.tramitesDao.findById(id);
      if (!tramite) {
        throw new NotFoundException(`Trámite con id ${id} no encontrado`);
      }

      this.logger.debug(`🗑️  Eliminando trámite con id: ${id}`);

      await this.tramitesDao.delete(id);

      this.logger.log(`✅ Trámite eliminado exitosamente: ${tramite.title}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`❌ Error al eliminar trámite con id ${id}`, error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas generales de trámites
   *
   * @returns Promise con objeto de estadísticas
   */
  async getStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    categories: string[];
  }> {
    try {
      this.logger.debug('📊 Obteniendo estadísticas de trámites');

      const [total, byCategory, categories] = await Promise.all([
        this.tramitesDao.count(),
        this.tramitesDao.countByCategory(),
        this.tramitesDao.findAllCategories(),
      ]);

      const stats = {
        total,
        byCategory,
        categories,
      };

      this.logger.log('✅ Estadísticas obtenidas exitosamente');
      return stats;
    } catch (error) {
      this.logger.error('❌ Error al obtener estadísticas', error);
      throw error;
    }
  }
}
