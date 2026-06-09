import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Animation } from './entities/kurumachi.entity';
import { Account, Session, VerificationToken } from './entities/nextauth.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Використовуємо локальну адресу, або назву сервісу з docker-compose
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'kurumachi',
      entities: [User, Animation, Account, Session, VerificationToken],
      // Автоматично створює таблиці в базі на основі сутностей (для розробки)
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
