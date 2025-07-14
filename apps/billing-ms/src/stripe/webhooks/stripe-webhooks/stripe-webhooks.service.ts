import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_SERVICE } from '../../constant';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhooksService {
    //In this we will setup the webhook handlers for various Stripe events like payment succeeded, invoice paid, etc.
    constructor(@Inject(STRIPE_SERVICE) private readonly stripeService: Stripe){}
    handlePaymentEvents(event:Stripe.Event): string {
        switch (event.type) {
           case 'invoice.payment_succeeded':
                const paymentSucceeded = event.data.object as Stripe.Invoice;
                console.log('Payment succeeded:', paymentSucceeded.id);
                // Handle the payment succeeded event
                return `Payment succeeded for invoice ${paymentSucceeded.id}`;
            case 'invoice.payment_failed':
                const paymentFailed = event.data.object as Stripe.Invoice;
                console.log('Payment failed:', paymentFailed.id);
                // Handle the payment failed event
                return `Payment failed for invoice ${paymentFailed.id}`;
            case 'invoice.upcoming':
                const upcomingInvoice = event.data.object as Stripe.Invoice;
                console.log('Upcoming invoice:', upcomingInvoice.id);
                // Handle the upcoming invoice event
                return `Upcoming invoice for ${upcomingInvoice.customer}`;
            case 'customer.subscription.updated':
                const subscriptionUpdated = event.data.object as Stripe.Subscription;
                console.log('Subscription updated:', subscriptionUpdated.id);
                // Handle the subscription updated event
                return `Subscription updated for ${subscriptionUpdated.customer}`;
            default:
                console.warn(`Unhandled event type: ${event.type}`);
                return `Unhandled event type: ${event.type}`;

        }
    }
}
