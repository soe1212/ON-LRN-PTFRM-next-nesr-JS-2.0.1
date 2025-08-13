import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}