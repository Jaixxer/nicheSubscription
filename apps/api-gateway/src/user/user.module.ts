import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { PrismaModule } from 'apps/api-gateway/prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { CreateUserHandler } from './handlers/user.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports:[PrismaModule,RedisModule,CqrsModule],
  providers: [UserRepository, CreateUserHandler], // ← Add handler
  controllers: [UserController],
  exports: [UserRepository]
})
export class UserModule {}
