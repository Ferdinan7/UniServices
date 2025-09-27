import {Controller, Get} from "@nestjs/common";
import { TramitesService } from "./tramites.service";

@Controller("tramites")
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Get()
  async findAll() {
    return this.tramitesService.getAll();
  }

  @Get("grouped")
  async findAllGrouped() {
    return this.tramitesService.findAllGrouped();
  }
}
