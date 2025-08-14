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
  app.setGlobalPrefix('api/recommendations');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Recommendation Service API')
    .setDescription('Personalized course recommendations service')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('recommendations', 'Course recommendations')
    .addTag('preferences', 'User preferences')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/recommendations/docs', app, document);

  // Connect to RabbitMQ for microservice communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'recommendation_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 4011;
  await app.listen(port);

  console.log(`🚀 Recommendation Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/recommendations/docs`);
}

bootstrap();