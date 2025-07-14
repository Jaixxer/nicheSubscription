import Stripe from "stripe";
import { STRIPE_SERVICE } from "../constant";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class StripePaymentService {
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
            console.log('Default payment method set successfully:', customer);
            return {message:"Default payment method set successfully", success: true, customer: customer,paymentMethodId: paymentMethodId};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to set your default payment method", success: false, error: error.message};
            }
        }
    }
}