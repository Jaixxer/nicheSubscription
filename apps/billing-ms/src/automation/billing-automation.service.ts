import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StripeSubscriptionsService } from "../stripe/subscriptions/stripe-subscriptions.service";

@Injectable()
export class BillingAutomationService {
  constructor(private readonly prismaService: PrismaService, private readonly stripeSubscriptionService: StripeSubscriptionsService) {}
  async fetchLatestBillingData(){
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const data = await this.prismaService.subscription.findMany({
        where: {
            nextBillingDate: {
                lte: now, // nextBillingDate has passed
                gte: twentyFourHoursAgo // within last 24 hours
            },
            status: { in: ["active", "payment_failed"] }
        }
    });
    
    let stripeData= new Array()
    for (const subscription of data) {
      try {
        if (subscription.stripeSubscriptionId) {
          let sudata = await this.stripeSubscriptionService.getSubscription(subscription.stripeSubscriptionId)
          if (sudata) {
            stripeData.push(sudata.subscription);
          } else {
            console.error(`Failed to retrieve Stripe subscription for ID ${subscription.stripeSubscriptionId}: ${sudata}`);
          }
        } else {
          console.error(`Subscription ${subscription.id} has no stripeSubscriptionId`);
        }
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
      }
    }
    const result = {
      db_data: data,
      stripe_data: stripeData
    }
    return result;
  }
async validateSubscriptionSync(db: any, stripe: any): Promise<boolean> {
    if (!db || !stripe) return true;

    const ms = 1000; // Stripe dates are in seconds
    console.log(stripe.items);
    console.log(stripe.start_date)
    // Validate required Stripe data before proceeding
    if (!stripe.start_date || !stripe.billing_cycle_anchor) {
      console.error(`Missing required Stripe timestamp data for subscription ${db.id}`);
      return false;
    }
    
    const check = (
      db.stripeSubscriptionId === stripe.id &&
      db.status === stripe.status &&
      new Date(db.startDate).getTime() === stripe.start_date * ms &&
      new Date(db.nextBillingDate).getTime() === stripe.billing_cycle_anchor * ms &&
      db.quantity === stripe.quantity &&
      db.autoRenew === !stripe.cancel_at_period_end
    );
    if (!check) {
      console.error(`Subscription data mismatch for ID ${db.id}:
        DB: ${JSON.stringify(db)}
        Stripe: ${JSON.stringify(stripe)}`);
      await this.prismaService.subscription.update({
        where: { stripeSubscriptionId: db.stripeSubscriptionId },
        data: {
          status: stripe.status,
          startDate: new Date(stripe.start_date * ms),
          nextBillingDate: new Date(stripe.billing_cycle_anchor * ms),
          quantity: stripe.quantity,
          autoRenew: !stripe.cancel_at_period_end,
        }
      });
      console.log(`Updated subscription ${db.id} with Stripe data.`);
      return false;
    }
    return true;
  }
    
}