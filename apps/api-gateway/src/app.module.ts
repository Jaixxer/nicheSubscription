import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module'
import {RedisModule} from './redis/redis.module'
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TestModule } from './test/test.module';
import { ProductModule } from './product/product.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { BoxItemModule } from './box-item/box-item.module';
import { ProductWizardModule } from './product-wizard/product-wizard.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),PrismaModule, RedisModule,HealthModule, AuthModule, UserModule,CqrsModule.forRoot(), TestModule,ProductModule,SubscriptionModule,BoxItemModule, ProductWizardModule,],
  controllers: [],
  providers:[],
  exports: [],
})
export class AppModule { }
