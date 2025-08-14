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
  app.setGlobalPrefix('api/ecommerce');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Service API')
    .setDescription('Shopping cart and orders management service')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('cart', 'Shopping cart management')
    .addTag('orders', 'Order management')
    .addTag('coupons', 'Coupon management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/ecommerce/docs', app, document);

  // Connect to RabbitMQ for microservice communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'ecommerce_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 4005;
  await app.listen(port);

  console.log(`🚀 Ecommerce Service is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/ecommerce/docs`);
}

bootstrap();