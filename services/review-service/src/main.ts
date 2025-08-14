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
  app.setGlobalPrefix('api/reviews');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Review Service API')
    .setDescription('Course reviews and ratings service')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('reviews', 'Course reviews')
    .addTag('ratings', 'Course ratings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/reviews/docs', app, document);

  // Connect to RabbitMQ for microservice communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'review_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 4007;
  await app.listen(port);

  console.log(`🚀 Review Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/reviews/docs`);
}

bootstrap();