import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}