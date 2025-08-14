import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { PreferenceModule } from './modules/preference/preference.module';
import { TrendingModule } from './modules/trending/trending.module';
import { HealthModule } from './modules/health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    RecommendationModule,
    PreferenceModule,
    TrendingModule,
    HealthModule,
  ],
})
export class AppModule {}