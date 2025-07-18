import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { STRIPE_SERVICE } from './constant';
import { StripeCustomerService } from './customers/stripe-customers.service';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import StripeProductService from './products/stripe-products.service';
import { StripePricesService } from './prices/stripe-prices.service';
import { StripeSubscriptionsService } from './subscriptions/stripe-subscriptions.service';

@Module({
  providers: [StripeService, StripeCustomerService, StripeProductService, StripePricesService, StripeSubscriptionsService],
  exports: [StripeService, StripeCustomerService, StripeProductService, StripePricesService, StripeSubscriptionsService, STRIPE_SERVICE]
})
export class StripeModule {
  static forRoot(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule],
      providers: [{
        provide: STRIPE_SERVICE,
        useFactory: (configService: ConfigService) => {
          return new Stripe(configService.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2025-06-30.basil',
            typescript: true,
          });
        },
        inject: [ConfigService]  
      }],
      exports: [STRIPE_SERVICE, StripeService, StripeCustomerService, StripeProductService, StripePricesService, StripeSubscriptionsService]
    };
  }
}
