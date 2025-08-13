import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private connection: Connection) {}

  async check() {
    try {
      // Check MongoDB connection
      const dbState = this.connection.readyState;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'content-service',
        database: dbState === 1 ? 'connected' : 'disconnected',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'content-service',
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}