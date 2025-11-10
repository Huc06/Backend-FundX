import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('FundX Backend API')
    .setDescription(
      'Backend API for FundX crowdfunding platform built with NestJS',
    )
    .setVersion('1.0')
    .addTag('Campaigns', 'Campaign management endpoints')
    .addTag('Images', 'Image upload endpoints')
    .addTag('Milestones', 'Milestone management endpoints')
    .addTag('Contributions', 'Contribution management endpoints')
    .addTag('Tiers', 'Tier management endpoints')
    .addTag('Profile', 'User profile and statistics endpoints')
    .addTag('Health', 'Health check endpoints')
    .addTag('Root', 'Root endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 FundX Backend running on port ${port}`);
  logger.log(`💚 Health check: http://localhost:${port}/health`);
  logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
