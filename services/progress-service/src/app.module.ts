import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { StreakModule } from './modules/streak/streak.module';
import { HealthModule } from './modules/health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    ProgressModule,
    CertificateModule,
    StreakModule,
    HealthModule,
  ],
})
export class AppModule {}