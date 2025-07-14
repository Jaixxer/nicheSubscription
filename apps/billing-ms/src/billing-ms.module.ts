import { Module } from '@nestjs/common';
import { BillingMsController } from './billing-ms.controller';
import { BillingMsService } from './billing-ms.service';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    StripeModule.forRoot(),
    EventsModule,
  ],
  controllers: [BillingMsController],
  providers: [BillingMsService],
})
export class BillingMsModule {}
