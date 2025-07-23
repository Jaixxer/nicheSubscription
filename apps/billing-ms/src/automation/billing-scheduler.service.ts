import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { BillingAutomationService } from "./billing-automation.service";
@Injectable()
export class BillingSchedulerService {
  constructor(private readonly billingAutomationService: BillingAutomationService) {}

  @Cron('45 * * * * *')
  async handleCron() {
    try {
        console.log('Running scheduled task to fetch latest billing data...');
      const latestBillingData = await this.billingAutomationService.fetchLatestBillingData();
      const validation = this.billingAutomationService.validateSubscriptionSync(latestBillingData.db_data, latestBillingData.stripe_data);
      if (!validation) {
        console.error('Subscription data validation failed.');
        return; 
      }

      console.log('Subscription data validation passed.');
      console.log('Latest billing data fetched successfully:', latestBillingData);
    } catch (error) {
      console.error('Error fetching latest billing data:', error);
    }
  }
  

}