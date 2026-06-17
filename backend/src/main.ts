import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { AuditInterceptor } from './audit/audit.interceptor';
import { AuditService } from './audit/audit.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''].filter(
      Boolean,
    ),
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // ← THÊM: Đăng ký Audit Interceptor global
  const auditService = app.get(AuditService);
  app.useGlobalInterceptors(new AuditInterceptor(auditService));

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
