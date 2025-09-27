import { Module } from "@nestjs/common";
import { TramitesModule } from "./tramites/tramites.module";

@Module({
  imports: [TramitesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
