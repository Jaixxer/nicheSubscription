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
            lastBillingDate: {
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

}