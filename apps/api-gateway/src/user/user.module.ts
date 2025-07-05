import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { PrismaModule } from 'apps/api-gateway/prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { CreateUserHandler } from './commandHandlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { FindUserByEmailHandler } from './queryHandlers';
import { UpdateUserHandler } from './commandHandlers/update-user.handler';
import { UpdaterUserEmailHandler } from './commandHandlers/update-user-email.hander';
import { FindUserByIdHandler } from './queryHandlers/find-user-by-id-query.handler';
import { UpdateUserPasswordHandler } from './commandHandlers/update-user-password.handler';

@Module({
  imports:[PrismaModule,RedisModule,CqrsModule],
  providers: [UserRepository, CreateUserHandler,FindUserByEmailHandler,UpdateUserHandler,UpdaterUserEmailHandler,FindUserByIdHandler,UpdateUserPasswordHandler], // ← Add handler
  controllers: [UserController],
  exports: [UserRepository]
})
export class UserModule {}
