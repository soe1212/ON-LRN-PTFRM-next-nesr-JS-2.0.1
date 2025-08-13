import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../search/elasticsearch.service';

@Injectable()
export class HealthService {
  constructor(private elasticsearchService: ElasticsearchService) {}

  async check() {
    try {
      // Check Elasticsearch connection
      const esHealth = await this.elasticsearchService.search({
        index: '_cluster',
        body: {
          query: { match_all: {} },
          size: 0,
        },
      });
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'search-service',
        elasticsearch: 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'search-service',
        elasticsearch: 'disconnected',
        error: error.message,
      };
    }
  }
}