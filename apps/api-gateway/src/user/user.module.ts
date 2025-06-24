import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'apps/api-gateway/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService] // Exporting UserService to be used in other modules
})
export class UserModule {}
