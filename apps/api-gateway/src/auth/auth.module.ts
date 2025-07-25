import { Module, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '../redis/redis.module';


@Module({
  imports: [UserModule,JwtModule.register({}),ConfigModule.forRoot({
    isGlobal: true}),CqrsModule,RedisModule],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}