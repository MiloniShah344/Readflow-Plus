import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ReadingLogsModule } from './reading-logs/reading-logs.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { ReadingLog } from './reading-logs/entities/reading-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url:
          process.env.DATABASE_URL ??
          'postgresql://postgres:Readflow2026@db.adxqtfxzsnnvawipvhkr.supabase.co:5432/postgres',
        entities: [User, Book, ReadingLog],
        synchronize: true,
        ssl: { rejectUnauthorized: false },
        logging: process.env.NODE_ENV === 'development',
        extra: {
          connectionTimeoutMillis: 5000,
        },
      }),
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    ReadingLogsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
