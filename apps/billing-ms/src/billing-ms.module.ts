import { Module } from '@nestjs/common';
import { BillingMsController } from './billing-ms.controller';
import { BillingMsService } from './billing-ms.service';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events/events.module';
import { BullModule } from '@nestjs/bullmq';
import { WebhookRecoveryQueueModule } from './automation/queues/webhook-recovery-queue/webhook-recovery-queue.module';
import { StripePaymentService } from './stripe/payment-methods/stripe-payment-service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    StripeModule.forRoot(),
    EventsModule,
    BullModule.forRoot({
      connection:{
        port: 6379,
        host: 'localhost',
        db:3
      }
    }),WebhookRecoveryQueueModule
  ],
  controllers: [BillingMsController],
  providers: [BillingMsService,StripePaymentService],
})
export class BillingMsModule {}
