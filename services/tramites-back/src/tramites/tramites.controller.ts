// src/tramites/tramites.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { Tramite } from './tramites.entity';
import { TramiteGroup } from './dto/tramite-group.dto';
import { PaginatedResult } from './dao/IGenericDao';

/**
 * Controlador de Trámites refactorizado usando el patrón DAO
 *
 * Este controlador maneja todas las peticiones HTTP relacionadas con trámites.
 * Delega la lógica de negocio al TramitesService, que a su vez usa el DAO
 * para el acceso a datos.
 *
 * Arquitectura en capas:
 * Controller → Service → DAO → Database
 *
 * Ventajas del patrón DAO aplicado:
 * - Separación de responsabilidades clara
 * - Fácil testing de cada capa
 * - Cambio de fuente de datos sin afectar el controlador
 * - APIs REST más ricas con menos esfuerzo
 */
@Controller('tramites')
export class TramitesController {
  private readonly logger = new Logger(TramitesController.name);

  constructor(private readonly tramitesService: TramitesService) {
    this.logger.log('✅ TramitesController inicializado');
  }

  /**
   * GET /tramites
   * Obtiene todos los trámites
   *
   * @returns Array de trámites
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Tramite[]> {
    this.logger.debug('📥 GET /tramites');
    return await this.tramitesService.getAll();
  }

  /**
   * GET /tramites/grouped
   * Obtiene trámites agrupados por categoría
   *
   * @returns Array de grupos de trámites
   */
  @Get('grouped')
  @HttpCode(HttpStatus.OK)
  async findAllGrouped(): Promise<TramiteGroup[]> {
    this.logger.debug('📥 GET /tramites/grouped');
    return await this.tramitesService.findAllGrouped();
  }

  /**
   * GET /tramites/paginated
   * Obtiene trámites con paginación
   *
   * @param page - Número de página (default: 1)
   * @param limit - Registros por página (default: 10)
   * @param orderBy - Campo de ordenamiento (default: created_at)
   * @param orderDirection - Dirección (asc/desc, default: desc)
   * @returns Resultado paginado
   */
  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  async findPaginated(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('orderBy') orderBy: string = 'created_at',
    @Query('orderDirection') orderDirection: 'asc' | 'desc' = 'desc',
  ): Promise<PaginatedResult<Tramite>> {
    this.logger.debug(
      `📥 GET /tramites/paginated?page=${page}&limit=${limit}&orderBy=${orderBy}&orderDirection=${orderDirection}`,
    );
    return await this.tramitesService.getPaginated(
      page,
      limit,
      orderBy,
      orderDirection,
    );
  }

  /**
   * GET /tramites/categories
   * Obtiene todas las categorías disponibles
   *
   * @returns Array de nombres de categorías
   */
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories(): Promise<string[]> {
    this.logger.debug('📥 GET /tramites/categories');
    return await this.tramitesService.getCategories();
  }

  /**
   * GET /tramites/statistics
   * Obtiene estadísticas de trámites
   *
   * @returns Objeto con estadísticas
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getStatistics(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    categories: string[];
  }> {
    this.logger.debug('📥 GET /tramites/statistics');
    return await this.tramitesService.getStatistics();
  }

  /**
   * GET /tramites/recent
   * Obtiene los trámites más recientes
   *
   * @param limit - Número de trámites (default: 10)
   * @returns Array de trámites recientes
   */
  @Get('recent')
  @HttpCode(HttpStatus.OK)
  async getRecent(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<Tramite[]> {
    this.logger.debug(`📥 GET /tramites/recent?limit=${limit}`);
    return await this.tramitesService.getRecent(limit);
  }

  /**
   * GET /tramites/search
   * Búsqueda global de trámites
   *
   * @param q - Término de búsqueda
   * @returns Array de trámites que coinciden
   */
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query('q') searchTerm: string): Promise<Tramite[]> {
    this.logger.debug(`📥 GET /tramites/search?q=${searchTerm}`);
    return await this.tramitesService.search(searchTerm);
  }

  /**
   * GET /tramites/search/title
   * Búsqueda por título
   *
   * @param q - Término de búsqueda
   * @returns Array de trámites que coinciden
   */
  @Get('search/title')
  @HttpCode(HttpStatus.OK)
  async searchByTitle(@Query('q') title: string): Promise<Tramite[]> {
    this.logger.debug(`📥 GET /tramites/search/title?q=${title}`);
    return await this.tramitesService.searchByTitle(title);
  }

  /**
   * GET /tramites/category/:category
   * Obtiene trámites de una categoría específica
   *
   * @param category - Nombre de la categoría
   * @returns Array de trámites de esa categoría
   */
  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  async findByCategory(
    @Param('category') category: string,
  ): Promise<Tramite[]> {
    this.logger.debug(`📥 GET /tramites/category/${category}`);
    return await this.tramitesService.findByCategory(category);
  }

  /**
   * GET /tramites/:id
   * Obtiene un trámite por su ID
   *
   * @param id - ID del trámite
   * @returns Trámite encontrado
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Tramite> {
    this.logger.debug(`📥 GET /tramites/${id}`);
    return await this.tramitesService.findById(id);
  }

  /**
   * POST /tramites
   * Crea un nuevo trámite
   *
   * @param tramiteData - Datos del trámite
   * @returns Trámite creado
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) tramiteData: Omit<Tramite, 'id' | 'created_at'>,
  ): Promise<Tramite> {
    this.logger.debug(`📥 POST /tramites - ${tramiteData.title}`);
    return await this.tramitesService.create(tramiteData);
  }

  /**
   * PUT /tramites/:id
   * Actualiza un trámite existente
   *
   * @param id - ID del trámite
   * @param updates - Datos a actualizar
   * @returns Trámite actualizado
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updates: Partial<Tramite>,
  ): Promise<Tramite> {
    this.logger.debug(`📥 PUT /tramites/${id}`);
    return await this.tramitesService.update(id, updates);
  }

  /**
   * DELETE /tramites/:id
   * Elimina un trámite
   *
   * @param id - ID del trámite
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.debug(`📥 DELETE /tramites/${id}`);
    await this.tramitesService.delete(id);
  }
}
