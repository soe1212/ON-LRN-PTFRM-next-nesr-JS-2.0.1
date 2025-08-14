import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionModule } from './modules/discussion/discussion.module';
import { ForumModule } from './modules/forum/forum.module';
import { HealthModule } from './modules/health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/discussions'),
    DiscussionModule,
    ForumModule,
    HealthModule,
  ],
})
export class AppModule {}