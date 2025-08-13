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
  app.setGlobalPrefix('api/courses');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Course Service API')
    .setDescription('Course management and content service')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('courses', 'Course management')
    .addTag('sections', 'Course sections')
    .addTag('lectures', 'Course lectures')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/courses/docs', app, document);

  // Connect to RabbitMQ for microservice communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'course_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 4002;
  await app.listen(port);

  console.log(`🚀 Course Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/courses/docs`);
}

bootstrap();