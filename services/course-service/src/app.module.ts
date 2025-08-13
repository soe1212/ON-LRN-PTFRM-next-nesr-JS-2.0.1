import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CourseModule } from './modules/course/course.module';
import { SectionModule } from './modules/section/section.module';
import { LectureModule } from './modules/lecture/lecture.module';
import { HealthModule } from './modules/health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    CourseModule,
    SectionModule,
    LectureModule,
    HealthModule,
  ],
})
export class AppModule {}