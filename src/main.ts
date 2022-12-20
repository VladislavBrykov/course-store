import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [process.env.ADMIN_DASHBOARD_URL, process.env.TERMINAL_APP_URL],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(Number(process.env['APPLICATION_PORT'] ?? 8080));
}
bootstrap();
