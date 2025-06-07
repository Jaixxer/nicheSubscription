import { Module } from '@nestjs/common';
import { BillingMsController } from './billing-ms.controller';
import { BillingMsService } from './billing-ms.service';

@Module({
  imports: [],
  controllers: [BillingMsController],
  providers: [BillingMsService],
})
export class BillingMsModule {}
