import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async checkHealth() {
    const services = this.configService.get('services');
    const serviceStatuses = {};

    // Check all registered services
    for (const [serviceName, config] of Object.entries(services)) {
      try {
        const startTime = Date.now();
        await firstValueFrom(
          this.httpService.get(`${config.url}/health`, {
            timeout: 5000,
          }),
        );
        serviceStatuses[serviceName] = {
          status: 'healthy',
          responseTime: Date.now() - startTime,
        };
      } catch (error) {
        serviceStatuses[serviceName] = {
          status: 'unhealthy',
          error: error.message,
        };
      }
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: serviceStatuses,
    };
  }
}