import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductEventsConsumer } from '../consumers/box-events.consumer';
import { SubscriptionEventsConsumer } from '../consumers/subscription-events.consumer';
import { PaymentEventsProducer } from '../producers/payment-events.producer';
import { SubscriptionEventsProducer } from '../producers/subscription-events.producer';
import { StripeModule } from '../../stripe/stripe.module';

@Module({
  imports: [
    StripeModule.forRoot(),
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  providers: [
    ProductEventsConsumer,
    SubscriptionEventsConsumer,
    PaymentEventsProducer,
    SubscriptionEventsProducer,
  ],
  exports: [
    PaymentEventsProducer,
    SubscriptionEventsProducer,
  ],
})
export class EventsModule {}
