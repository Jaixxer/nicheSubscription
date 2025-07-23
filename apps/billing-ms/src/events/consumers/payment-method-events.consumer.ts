import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
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

  @MessagePattern('setup.intent.created')
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
        clientSecret: setupIntentResult.setupIntent.client_secret,
        stripeCustomerId: data.stripeCustomerId,
        
      };

    } catch (error) {
      this.logger.error(`Error processing SetupIntentCreated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern('setup.intent.confirmed')
  async handleSetupIntentConfirmed(data:{setupIntentId:string,paymentMethodId:string,stripeCustomerId:string}){
    try{
      this.logger.log(`Processing SetupIntentConfirmed event for setupIntentId: ${data.setupIntentId}`);
      const confirmSetupIntent= await this.stripePaymentService.confirmSetupIntent(data)
      
      if(!confirmSetupIntent || !confirmSetupIntent.success){
        this.logger.error(`Failed to confirm setup intent for setupIntentId: ${data.setupIntentId}`, confirmSetupIntent);
        return {
          success: false,
          error: confirmSetupIntent?.error || 'Failed to confirm setup intent'
        };
      }

      this.logger.log(`Successfully confirmed setup intent for setupIntentId: ${data.setupIntentId}`)
      
      // Set default payment method
      const setDefaultPaymentMethod = await this.stripePaymentService.setDefaultPaymentMethod(
        data.stripeCustomerId,
        data.paymentMethodId
      );
      
      if (!setDefaultPaymentMethod || !setDefaultPaymentMethod.success) {
        this.logger.error(`Failed to set default payment method for customerId: ${data.stripeCustomerId}`, setDefaultPaymentMethod);
        return {
          success: false,
          error: setDefaultPaymentMethod?.error || 'Failed to set default payment method'
        };
      }
      
      this.logger.log(`Successfully set default payment method for customerId: ${data.stripeCustomerId}`);
      return {
        success: true,
        message: 'Setup intent confirmed and default payment method set successfully'
      };
      
    }catch(error){
      this.logger.error(`Error processing SetupIntentConfirmed event: ${error.message}`, error.stack);
      return {
        success: false,
        error: error.message
      };
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
