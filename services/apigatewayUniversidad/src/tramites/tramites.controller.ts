import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Role } from '../auth/roles.guard';
import { Roles } from '../common/decorators';
import { TramitesService } from './tramites.service';

@ApiTags('Tramites')
@Controller('tramites')
@UseGuards(AuthGuard)
export class TramitesController {
  constructor(private tramitesService: TramitesService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.AUTHENTICATED, Role.ADMIN, Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tramites' })
  @ApiResponse({
    status: 200,
    description: 'List of tramites',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          requirements: {
            type: 'array',
            items: { type: 'string' }
          },
          estimatedTime: { type: 'string' },
          cost: { type: 'number' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getTramites(@Request() req: any) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      return await this.tramitesService.getAllTramites(token);
    } catch (error) {
      throw new HttpException(
        'Error fetching tramites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('grouped')
  @UseGuards(RolesGuard)
  @Roles(Role.AUTHENTICATED, Role.ADMIN, Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tramites grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Tramites grouped by category',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            requirements: {
              type: 'array',
              items: { type: 'string' }
            },
            estimatedTime: { type: 'string' },
            cost: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getGroupedTramites(@Request() req: any) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      return await this.tramitesService.getGroupedTramites(token);
    } catch (error) {
      throw new HttpException(
        'Error fetching grouped tramites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}