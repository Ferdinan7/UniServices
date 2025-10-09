// src/tramites/tramites.module.ts

import { Module } from '@nestjs/common';
import { TramitesController } from './tramites.controller';
import { TramitesService } from './tramites.service';
import { SupabaseService } from '../config/supabase.service';
import { TramitesDao } from './dao/impl/TramitesDao';

/**
 * Módulo de Trámites refactorizado con patrón DAO
 *
 * Arquitectura:
 * - Controller: Maneja las peticiones HTTP (TramitesController)
 * - Service: Contiene la lógica de negocio (TramitesService)
 * - DAO: Maneja el acceso a datos (TramitesDao)
 * - Entity: Representa el modelo de datos (Tramite)
 *
 * Patrón DAO aplicado:
 * El servicio ahora depende del DAO en lugar de acceder directamente
 * a Supabase, lo que proporciona:
 * - Mejor separación de responsabilidades
 * - Código más testeable
 * - Facilidad para cambiar la fuente de datos
 * - Centralización de queries
 */
@Module({
  controllers: [TramitesController],
  providers: [
    SupabaseService, // Proveedor de cliente Supabase
    TramitesDao, // DAO para acceso a datos (patrón DAO)
    TramitesService, // Servicio con lógica de negocio
  ],
  exports: [
    TramitesService, // Exportar para uso en otros módulos
    TramitesDao, // Exportar DAO si otros módulos lo necesitan
  ],
})
export class TramitesModule {}
