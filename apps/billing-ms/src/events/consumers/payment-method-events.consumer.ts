import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StripePaymentService } from '../../stripe/payment-methods/stripe-payment-service';
import {
  SetupIntentCreatedEvent,
  DefaultPaymentMethodSetEvent,
} from '../dto/incoming-events.dto';

@Injectable()
export class PaymentMethodEventsConsumer {
  private readonly logger = new Logger(PaymentMethodEventsConsumer.name);

  constructor(
    private readonly stripePaymentService: StripePaymentService,
  ) {}

  @EventPattern('setup.intent.created')
  async handleSetupIntentCreated(data: SetupIntentCreatedEvent) {
    try {
      this.logger.log(`Processing SetupIntentCreated event for customerId: ${data.customerId}`);

      const setupIntentResult = await this.stripePaymentService.sendSetupIntent(data.stripeCustomerId);

      if (!setupIntentResult || !setupIntentResult.success || !setupIntentResult.setupIntent) {
        throw new Error(`Failed to create setup intent: ${setupIntentResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed SetupIntentCreated event for customerId: ${data.customerId}`);
      return {
        success: true,
        customerId: data.customerId,
        stripeCustomerId: data.stripeCustomerId,
        setupIntent: setupIntentResult.setupIntent,
      };

    } catch (error) {
      this.logger.error(`Error processing SetupIntentCreated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('default.payment.method.set')
  async handleDefaultPaymentMethodSet(data: DefaultPaymentMethodSetEvent) {
    try {
      this.logger.log(`Processing DefaultPaymentMethodSet event for customerId: ${data.customerId}`);

      const paymentMethodResult = await this.stripePaymentService.setDefaultPaymentMethod(
        data.stripeCustomerId,
        data.stripePaymentMethodId
      );

      if (!paymentMethodResult || !paymentMethodResult.success) {
        throw new Error(`Failed to set default payment method: ${paymentMethodResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed DefaultPaymentMethodSet event for customerId: ${data.customerId}`);
      return {
        success: true,
        customerId: data.customerId,
        stripeCustomerId: data.stripeCustomerId,
        paymentMethodId: data.paymentMethodId,
        stripePaymentMethodId: data.stripePaymentMethodId,
      };

    } catch (error) {
      this.logger.error(`Error processing DefaultPaymentMethodSet event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
