import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module'
import {RedisModule} from './redis/redis.module'
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TestModule } from './test/test.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),PrismaModule, RedisModule,HealthModule, AuthModule, UserModule,CqrsModule.forRoot(), TestModule],
  controllers: [],
  providers:[],
  exports: [],
})
export class AppModule { }
