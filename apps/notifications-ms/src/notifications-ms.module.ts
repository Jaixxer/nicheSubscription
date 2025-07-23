import { Module } from '@nestjs/common';
import { NotificationsMsController } from './notifications-ms.controller';
import { NotificationsMsService } from './notifications-ms.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigService],
  controllers: [NotificationsMsController],
  providers: [NotificationsMsService],
})
export class NotificationsMsModule {}
