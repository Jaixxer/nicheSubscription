import Stripe from "stripe";
import { STRIPE_SERVICE } from "../constant";
import { Inject, Injectable,Logger } from "@nestjs/common";

@Injectable()
export class StripePaymentService {
    private readonly logger = new Logger(StripePaymentService.name)
    constructor(@Inject(STRIPE_SERVICE) private readonly stripeService: Stripe) { }
    async sendSetupIntent(customerId: string) {
            try {
                console.log('Creating setup intent for customer:', customerId);
                const setupIntent = await this.stripeService.setupIntents.create({
                    customer: customerId,
                    payment_method_types: ['card'],
                });
                console.log('Setup intent created successfully:', setupIntent);
                return {message:"Setup intent created successfully", success: true, setupIntent: setupIntent};
            } catch (error) {
                if (error instanceof Stripe.errors.StripeError) {
                    console.error('Stripe error occurred:', error.message);
                    return {message:"An error occurred while trying to create your stripe setup intent", success: false, error: error.message};
                }
            }
        }
    async setDefaultPaymentMethod(customerId: string, paymentMethodId: string) {
        try {
            console.log('Setting default payment method for customer:', customerId, 'to payment method:', paymentMethodId);
            const customer = await this.stripeService.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            if (!customer){
                throw new Error('Failed to set default payment method');
            }
            console.log('Default payment method set successfully:', customer);
            return {message:"Default payment method set successfully", success: true, customer: customer};
        } catch (error) {
            if (error) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to set your default payment method", success: false, error: error.message};
            }
        }
    }
    async confirmSetupIntent(data:{setupIntentId: string, paymentMethodId: string, stripeCustomerId: string}) {
        try {
            this.logger.log('Processing setup intent for stripeCustomerId: ',data.stripeCustomerId, 'with setupIntentId:', data.setupIntentId);
            
            // First, retrieve the setup intent to check its status
            const setupIntent = await this.stripeService.setupIntents.retrieve(data.setupIntentId);
            
            if (!setupIntent) {
                throw new Error('Setup intent not found');
            }
            
            this.logger.log(`Setup intent status: ${setupIntent.status} for setupIntentId: ${data.setupIntentId}`);
            
            // If already succeeded, we don't need to confirm it again
            if (setupIntent.status === 'succeeded') {
                this.logger.log('Setup intent already succeeded, skipping confirmation');
                return {message:"Setup intent already confirmed successfully", success: true, setupIntent: setupIntent};
            }
            
            // If requires confirmation, confirm it
            if (setupIntent.status === 'requires_confirmation') {
                const confirmedSetupIntent = await this.stripeService.setupIntents.confirm(data.setupIntentId, {
                    payment_method: data.paymentMethodId,
                });
                
                if (!confirmedSetupIntent || confirmedSetupIntent.status !== 'succeeded') {
                    throw new Error(`Failed to confirm setup intent. Status: ${confirmedSetupIntent?.status || 'unknown'}`);
                }
                
                this.logger.log('Setup intent confirmed successfully:', confirmedSetupIntent);
                return {message:"Setup intent confirmed successfully", success: true, setupIntent: confirmedSetupIntent};
            }
            
            // If in any other status, return error
            throw new Error(`Setup intent is in unexpected status: ${setupIntent.status}`);
            
        } catch (error) {
            this.logger.error('Error processing setup intent:', error);
            if (error instanceof Stripe.errors.StripeError) {
                return {message:"An error occurred while trying to process setup intent", success: false, error: error.message};
            }
            return {message:"An error occurred while trying to process setup intent", success: false, error: error.message};
        }
    }
}