import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '../redis/redis.module';
import { FetchPasswordQueryHandler } from './queryHandlers/fetch-password.handler';
import { AddPhoneNumberHandler } from './commandHandlers/add-phone-number.handler';
import { LoginHandler } from './commandHandlers/login.handler';
import { RegisterHandler } from './commandHandlers/register.handler';
import { SendEmailVerificationHandler } from './commandHandlers/send-email-verification.handler';
import { SendPhoneVerificationHandler } from './commandHandlers/send-phone-verification.handler';
import { VerifyEmailHandler } from './commandHandlers/verify-email.handler';
import { VerifyPhoneHandler } from './commandHandlers/verify-phone.handler';
import { AuthRepository } from './repositories/auth.repository';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [UserModule,JwtModule.register({}),ConfigModule.forRoot({
  isGlobal: true}),CqrsModule,RedisModule],
  providers: [AuthRepository,PasswordService,TokenService,JwtStrategy,FetchPasswordQueryHandler,AddPhoneNumberHandler,LoginHandler,RegisterHandler,SendEmailVerificationHandler,SendPhoneVerificationHandler,VerifyEmailHandler,VerifyPhoneHandler],
  controllers: [AuthController]
})
export class AuthModule {}