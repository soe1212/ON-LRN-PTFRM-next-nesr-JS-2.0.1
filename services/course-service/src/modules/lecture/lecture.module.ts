import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LectureController],
  providers: [LectureService],
  exports: [LectureService],
})
export class LectureModule {}