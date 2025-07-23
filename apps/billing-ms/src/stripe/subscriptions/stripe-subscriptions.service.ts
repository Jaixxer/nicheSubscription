import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { STRIPE_SERVICE } from "../constant"
import Stripe from "stripe";

@Injectable()
export class StripeSubscriptionsService{
    constructor(@Inject(STRIPE_SERVICE) private readonly stripeService:Stripe){}
    

    async createSubscription(stripeCuratorId: string,data: Stripe.SubscriptionCreateParams) {
        try {
            console.log('Creating subscription with data:', data);
            const subscription = await this.stripeService.subscriptions.create({
                customer: data.customer,
                items: data.items,
                metadata: data.metadata || {},
                payment_settings: {
                    payment_method_types: ["card"],
                    save_default_payment_method: 'on_subscription'
                },
                transfer_data: {
                    destination: stripeCuratorId
                },
                application_fee_percent: 4,
                collection_method: data.collection_method || 'charge_automatically'
            });
            console.log('Subscription created successfully:', subscription);
            return {message:"Subscription created successfully", success: true, subscription: subscription};
        } catch (error) {
            console.error('Error creating Stripe subscription:', error);
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to create your stripe subscription", success: false, error: error.message};
            }
            // Handle non-Stripe errors
            return {message:"An error occurred while trying to create your stripe subscription", success: false, error: error.message || 'Unknown error'};
        }
    }
    async getSubscription(subscriptionId: string) {
        try {
            console.log('Retrieving subscription with ID:', subscriptionId);
            const subscription = await this.stripeService.subscriptions.retrieve(subscriptionId);
            console.log('Subscription retrieved successfully:', subscription);
            return {message:"Subscription retrieved successfully", success: true, subscription: subscription};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to retrieve your stripe subscription", success: false, error: error.message};
            }
        }
    }
    async updateSubscription(subscriptionId: string, data: Stripe.SubscriptionUpdateParams) {
        try {
            console.log('Updating subscription with ID:', subscriptionId, 'and data:', data);
            const subscription = await this.stripeService.subscriptions.update(subscriptionId, data);
            console.log('Subscription updated successfully:', subscription);
            return {message:"Subscription updated successfully", success: true, subscription: subscription};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to update your stripe subscription", success: false, error: error.message};
            }
        }
    }
    async cancelSubscription(subscriptionId: string) {
        try {
            console.log('Cancelling subscription with ID:', subscriptionId);
            const deletedSubscription = await this.stripeService.subscriptions.cancel(subscriptionId);
            console.log('Subscription cancelled successfully:', deletedSubscription);
            return {message:"Subscription cancelled successfully", success: true, subscription: deletedSubscription};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to cancel your stripe subscription", success: false, error: error.message};
            }
        }
    }
}