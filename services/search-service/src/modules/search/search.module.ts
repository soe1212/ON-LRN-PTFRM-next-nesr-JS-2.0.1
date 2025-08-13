import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, ElasticsearchService],
  exports: [SearchService],
})
export class SearchModule {}