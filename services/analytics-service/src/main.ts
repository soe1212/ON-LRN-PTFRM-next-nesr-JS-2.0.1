import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for HTTP routes
  app.setGlobalPrefix('api/analytics');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Analytics Service API')
    .setDescription('Usage analytics and reports service')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('analytics', 'Usage analytics')
    .addTag('reports', 'Analytics reports')
    .addTag('metrics', 'Key metrics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/analytics/docs', app, document);

  // Connect to RabbitMQ for microservice communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'analytics_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 4012;
  await app.listen(port);

  console.log(`🚀 Analytics Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/analytics/docs`);
}

bootstrap();