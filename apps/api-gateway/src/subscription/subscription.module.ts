import { Get, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionQueryRepository } from './repositories/subscription.query.repository';
import { SubscriptionCommandRepository } from './repositories/subscription.command.repository';
import { CancelSubscriptionCommandHandler, CreateSubscriptionCommandHandler, UpdateSubscriptionCommandHandler } from './commandHandlers';
import { ProductModule } from '../product/product.module';
import { ProductRepository } from '../product/repository/repository.product';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../prisma/prisma.module';
import { GetSubscriptionByUserQueryHandler } from './queryHandlers';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ProductModule, CqrsModule, PrismaModule, RedisModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionQueryRepository,
    SubscriptionCommandRepository,
    ProductRepository,
    CreateSubscriptionCommandHandler,
    UpdateSubscriptionCommandHandler,
    GetSubscriptionByUserQueryHandler,
    CancelSubscriptionCommandHandler
  ]
})
export class SubscriptionModule {}
