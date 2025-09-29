import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServicesConfig } from '../config';

@Injectable()
export class TramitesService {
  private readonly tramitesServiceUrl: string;
  private readonly timeout: number;

  constructor(private configService: ConfigService) {
    const servicesConfig = this.configService.get<ServicesConfig>('servicesConfig');
    this.tramitesServiceUrl = servicesConfig?.tramitesService.url || 'http://localhost:3550/tramites';
    this.timeout = servicesConfig?.tramitesService.timeout || 5000;
  }

  async getAllTramites(token?: string): Promise<any[]> {
    try {
      const response = await fetch(this.tramitesServiceUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new HttpException(
          `Tramites service error: ${response.statusText}`,
          response.status,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('Error fetching tramites:', error);
      throw new HttpException(
        'Failed to fetch tramites from service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getGroupedTramites(token?: string): Promise<Record<string, any[]>> {
    try {
      const response = await fetch(`${this.tramitesServiceUrl}/grouped`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new HttpException(
          `Tramites service error: ${response.statusText}`,
          response.status,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      console.error('Error fetching grouped tramites:', error);
      throw new HttpException(
        'Failed to fetch grouped tramites from service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}