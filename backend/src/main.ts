import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS — cho phép frontend gọi API
  app.enableCors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL || '', // thêm dòng này
    ].filter(Boolean),
    credentials: true,
  });

  // Global prefix — tất cả API đều bắt đầu bằng /api
  app.setGlobalPrefix('api');

  // Validation pipe — tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // bỏ field lạ
      forbidNonWhitelisted: true,
      transform: true, // auto convert type
    }),
  );

  // Global exception filter — bắt tất cả lỗi, trả về JSON chuẩn
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger UI tại /api/docs
  const config = new DocumentBuilder()
    .setTitle('CRM API')
    .setDescription('CRM Order Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 Backend running at http://localhost:3000');
  console.log('📄 Swagger docs at http://localhost:3000/api/docs');
}
bootstrap();
