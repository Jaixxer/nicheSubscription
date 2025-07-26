import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { PrismaModule } from 'apps/api-gateway/prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { FindUserByEmailHandler } from './queryHandlers';
import { UpdateUserHandler } from './commandHandlers/update-user.handler';
import { UpdaterUserEmailHandler } from './commandHandlers/update-user-email.hander';
import { FindUserByIdHandler } from './queryHandlers/find-user-by-id-query.handler';
import { UpdateUserPasswordHandler } from './commandHandlers/update-user-password.handler';
import { CreateConnectedAccountHandler } from './commandHandlers/create-connected-account.handler';
import { CheckUserStripeIdHandler } from './queryHandlers/check-user-stripeId.handler';
import { CreateSetupIntentHandler } from './commandHandlers/create-setup-intent.handler';
import { ConfirmSetupIntentCommandHandler } from './commandHandlers/confirm-setup-intent.handler';

@Module({
  imports:[PrismaModule,RedisModule,CqrsModule],
  providers: [UserRepository,FindUserByEmailHandler,CreateConnectedAccountHandler,UpdateUserHandler,UpdaterUserEmailHandler,FindUserByIdHandler,UpdateUserPasswordHandler,CheckUserStripeIdHandler,CreateSetupIntentHandler,ConfirmSetupIntentCommandHandler], // ← Add handler
  controllers: [UserController],
  exports: [UserRepository]
})
export class UserModule {}
