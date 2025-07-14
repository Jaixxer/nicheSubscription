import { Inject, Injectable } from "@nestjs/common";
import { STRIPE_SERVICE } from './../constant';
import Stripe from "stripe";
import { CreateCustomerDto } from "./dto.stripe-customers";
@Injectable()
export class StripeCustomerService {
    constructor(@Inject(STRIPE_SERVICE) private readonly stripeService: Stripe) { }

    async createConnectedAccount(email: string): Promise<{
    success: boolean;
    message: string;
    account?: Stripe.Account;
    error?: string;
    accountLink?: Stripe.AccountLink;
  }> {
    try {
      const account = await this.stripeService.accounts.create({
        type: 'express',
        country: 'US',
        email,
        capabilities: {
          transfers: { requested: true },
        },
      });
      const accountLink = await this.stripeService.accountLinks.create({
  account: account.id,
  refresh_url: 'http://localhost:3000/onboarding/refresh',
  return_url: 'http://localhost:3000/onboarding/return',
  type: 'account_onboarding',
});


      console.log('Connected account created:', account.id);

      return {
        message: 'Curator connected account created successfully',
        success: true,
        account,
        accountLink
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        console.error('Stripe error:', error.message);
        return {
          message: 'Stripe error occurred while creating connected account',
          success: false,
          error: error.message,
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          message: 'Unexpected error occurred',
          success: false,
          error: 'Internal server error',
        };
      }
    }
  }

    async createCustomer(data: CreateCustomerDto) {
        try {
            console.log('Creating customer with data:', data);
            const customer = await this.stripeService.customers.create({
                email: data.email,
                name: data.name,
                address: data.address || undefined,
                phone: data.phone || undefined,
                shipping: data.shipping || undefined,
            });
            console.log('Customer created successfully:', customer);
            return { message: "Customer created successfully", success: true, customer: customer };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return { message: "An error occured while trying to create your stripe account", success: false, error: error.message };
            }

        }
    }
    async getCustomer(customerId: string) {
        try {
            console.log('Retrieving customer with ID:', customerId);
            const customer = await this.stripeService.customers.retrieve(customerId);
            console.log('Customer retrieved successfully:', customer);
            return { message: "Customer retrieved successfully", success: true, customer: customer };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return { message: "An error occured while trying to retrieve your stripe account", success: false, error: error.message };
            }
        }
    }
    async updateCustomer(customerId: string, data: Stripe.CustomerUpdateParams) {
        try {
            console.log('Updating customer with ID:', customerId, 'and data:', data);
            const customer = await this.stripeService.customers.update(customerId, data);
            console.log('Customer updated successfully:', customer);
            return { message: "Customer updated successfully", success: true, customer: customer };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return { message: "An error occured while trying to update your stripe account", success: false, error: error.message };
            }
        }
    }
}