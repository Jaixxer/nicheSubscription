import { Injectable } from '@nestjs/common';
import { StripeCustomerService } from './stripe/customers/stripe-customers.service';

@Injectable()
export class BillingMsService {
  constructor(private stripeCustomerService: StripeCustomerService) {}
  getHello(): string {
    return 'Hello World!';
  }
  createCustomer(data: any) {
    return this.stripeCustomerService.createCustomer(data);
  }
}
