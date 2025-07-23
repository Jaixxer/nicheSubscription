import { Get, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionQueryRepository } from './repositories/subscription.query.repository';
import { SubscriptionCommandRepository } from './repositories/subscription.command.repository';
import { CancelSubscriptionCommandHandler, CreateSubscriptionCommandHandler, UpdateSubscriptionCommandHandler } from './commandHandlers';
import { ProductModule } from '../product/product.module';
import { ProductRepository } from '../product/repository/repository.product';
import { UserRepository } from '../user/repositories/user.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../prisma/prisma.module';
import { GetSubscriptionByUserQueryHandler } from './queryHandlers';
import { RedisModule } from '../redis/redis.module';
import { CancelSubscriptionAdminCommandHandler } from './commandHandlers/admin/cancel-subscription.handler';
import { GetSubscriptionsQueryHandler } from './queryHandlers/admin/get-subscription.handler';
@Module({
  imports: [ProductModule, CqrsModule, PrismaModule, RedisModule],
controllers: [SubscriptionController],
  providers: [
    SubscriptionQueryRepository,
    SubscriptionCommandRepository,
    ProductRepository,
    UserRepository,
    CreateSubscriptionCommandHandler,
    UpdateSubscriptionCommandHandler,
    GetSubscriptionByUserQueryHandler,
    CancelSubscriptionCommandHandler,
    CancelSubscriptionAdminCommandHandler,
    GetSubscriptionsQueryHandler
  ]
})
export class SubscriptionModule {}
