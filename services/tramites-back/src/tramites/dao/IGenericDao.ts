// src/tramites/dao/IGenericDao.ts

/**
 * Interfaz DAO genérica que define operaciones CRUD básicas
 *
 * Patrón DAO (Data Access Object):
 * Proporciona una interfaz abstracta para acceder a datos,
 * ocultando los detalles de implementación de la fuente de datos.
 *
 * Ventajas:
 * - Separación de la lógica de negocio y la lógica de acceso a datos
 * - Fácil cambio de fuente de datos sin afectar la lógica de negocio
 * - Código más testeable con mocks
 * - Cumple con el principio de responsabilidad única
 *
 * @template T - Tipo de la entidad que maneja el DAO
 */
export interface IGenericDao<T> {
  /**
   * Encuentra todos los registros de la entidad
   * @returns Promise con array de entidades
   * @throws Error si hay un problema con la base de datos
   */
  findAll(): Promise<T[]>;

  /**
   * Encuentra un registro por su ID
   * @param id - Identificador único del registro
   * @returns Promise con la entidad encontrada o null si no existe
   * @throws Error si hay un problema con la base de datos
   */
  findById(id: number | string): Promise<T | null>;

  /**
   * Encuentra registros que cumplan con un criterio
   * @param criteria - Objeto con los criterios de búsqueda
   * @returns Promise con array de entidades que cumplen el criterio
   * @throws Error si hay un problema con la base de datos
   */
  findBy(criteria: Partial<T>): Promise<T[]>;

  /**
   * Crea un nuevo registro en la base de datos
   * @param entity - Datos de la entidad a crear
   * @returns Promise con la entidad creada (incluyendo el ID generado)
   * @throws Error si hay un problema con la base de datos
   */
  create(entity: Omit<T, 'id' | 'created_at'>): Promise<T>;

  /**
   * Actualiza un registro existente
   * @param id - Identificador del registro a actualizar
   * @param entity - Datos parciales a actualizar
   * @returns Promise con la entidad actualizada
   * @throws Error si el registro no existe o hay un problema con la BD
   */
  update(id: number | string, entity: Partial<T>): Promise<T>;

  /**
   * Elimina un registro de la base de datos
   * @param id - Identificador del registro a eliminar
   * @returns Promise<void>
   * @throws Error si el registro no existe o hay un problema con la BD
   */
  delete(id: number | string): Promise<void>;

  /**
   * Cuenta el número total de registros
   * @returns Promise con el número de registros
   * @throws Error si hay un problema con la base de datos
   */
  count(): Promise<number>;

  /**
   * Verifica si existe un registro con el ID dado
   * @param id - Identificador a verificar
   * @returns Promise<boolean> true si existe, false en caso contrario
   */
  exists(id: number | string): Promise<boolean>;
}

/**
 * Opciones para paginación
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Interfaz extendida para DAOs que soportan paginación
 */
export interface IPaginableDao<T> extends IGenericDao<T> {
  /**
   * Encuentra registros con paginación
   * @param options - Opciones de paginación
   * @returns Promise con resultado paginado
   */
  findAllPaginated(options: PaginationOptions): Promise<PaginatedResult<T>>;
}
