import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductEventsConsumer } from '../consumers/box-events.consumer';
import { SubscriptionEventsConsumer } from '../consumers/subscription-events.consumer';
import { CustomerEventsConsumer } from '../consumers/customer-events.consumer';
import { PriceEventsConsumer } from '../consumers/price-events.consumer';
import { PaymentMethodEventsConsumer } from '../consumers/payment-method-events.consumer';
import { PaymentEventsProducer } from '../producers/payment-events.producer';
import { SubscriptionEventsProducer } from '../producers/subscription-events.producer';
import { StripeModule } from '../../stripe/stripe.module';
import { StripeService } from '../../stripe/stripe.service';
import { StripePaymentService } from '../../stripe/payment-methods/stripe-payment-service';

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
  controllers: [
    ProductEventsConsumer,
    StripePaymentService,
    SubscriptionEventsConsumer,
    CustomerEventsConsumer,
    PriceEventsConsumer,
    PaymentMethodEventsConsumer,
  ],
  providers: [
    PaymentEventsProducer,
    SubscriptionEventsProducer,
    StripePaymentService,
    
  ],
  exports: [
    PaymentEventsProducer,
    SubscriptionEventsProducer,
  ],
})
export class EventsModule {}
