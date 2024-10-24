import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
