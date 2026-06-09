import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Дозволяємо крос-доменні запити з нашого фронтенду
  app.enableCors();

  await app.listen(4000);
  console.info(`🚀 Backend running on: http://localhost:4000`);
}
bootstrap();
