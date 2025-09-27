import { Module } from "@nestjs/common";
import { TramitesService } from "./tramites.service";
import { TramitesController } from "./tramites.controller";
import { SupabaseService } from "../config/supabase.service";

@Module({
  imports: [],
  controllers: [TramitesController],
  providers: [TramitesService, SupabaseService],
  exports: [TramitesService],
})
export class TramitesModule {}
