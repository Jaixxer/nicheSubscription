import { Module } from '@nestjs/common';
import { NotificationsMsController } from './notifications-ms.controller';
import { NotificationsMsService } from './notifications-ms.service';

@Module({
  imports: [],
  controllers: [NotificationsMsController],
  providers: [NotificationsMsService],
})
export class NotificationsMsModule {}
