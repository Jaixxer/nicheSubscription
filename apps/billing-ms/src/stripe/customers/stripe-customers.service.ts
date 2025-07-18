import { Inject, Injectable, Logger } from "@nestjs/common";
import { STRIPE_SERVICE } from './../constant';
import Stripe from "stripe";
import { CreateCustomerDto } from "./dto.stripe-customers";
@Injectable()
export class StripeCustomerService {
    private readonly logger = new Logger(StripeCustomerService.name);
    
    constructor(@Inject(STRIPE_SERVICE) private readonly stripeService: Stripe) { }

    async createConnectedAccount(email: string): Promise<{
    success: boolean;
    message: string;
    account?: Stripe.Account;
    error?: string;
    accountLink?: Stripe.AccountLink;
  }> {
    try {
      this.logger.log(`Creating connected account for email: ${email}`);
      
      const account = await this.stripeService.accounts.create({
        type: 'express',
        country: 'US',
        email,
        capabilities: {
          transfers: { requested: true },
        },
      });
      
      this.logger.log(`Connected account created with ID: ${account.id}`);
      
      const accountLink = await this.stripeService.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:3000/onboarding/refresh',
        return_url: 'http://localhost:3000/onboarding/return',
        type: 'account_onboarding',
      });

      this.logger.log(`Account link created for account: ${account.id}`);

      return {
        message: 'Curator connected account created successfully',
        success: true,
        account,
        accountLink
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        this.logger.error(`Stripe error creating connected account for ${email}: ${error.message}`, error.stack);
        return {
          message: 'Stripe error occurred while creating connected account',
          success: false,
          error: error.message,
        };
      } else {
        this.logger.error(`Unexpected error creating connected account for ${email}: ${error.message}`, error.stack);
        return {
          message: 'Unexpected error occurred',
          success: false,
          error: error.message,
        };
      }
    }
  }

    async createCustomer(data: CreateCustomerDto) {
        try {
            this.logger.log(`Creating customer with email: ${data.email}`);
            
            const customer = await this.stripeService.customers.create({
                email: data.email,
                name: data.name,
                address: data.address || undefined,
                phone: data.phone || undefined,
                shipping: data.shipping || undefined,
            });
            
            this.logger.log(`Customer created successfully with ID: ${customer.id}`);
            return { message: "Customer created successfully", success: true, customer: customer };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                this.logger.error(`Stripe error creating customer for ${data.email}: ${error.message}`, error.stack);
                return { message: "An error occured while trying to create your stripe account", success: false, error: error.message };
            } else {
                this.logger.error(`Unexpected error creating customer for ${data.email}: ${error.message}`, error.stack);
                return { message: "An unexpected error occurred", success: false, error: error.message };
            }
        }
    }
    async getCustomer(customerId: string) {
        try {
            this.logger.log(`Retrieving customer with ID: ${customerId}`);
            
            const customer = await this.stripeService.customers.retrieve(customerId);
            
            this.logger.log(`Customer retrieved successfully: ${customerId}`);
            return { message: "Customer retrieved successfully", success: true, customer: customer };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                this.logger.error(`Stripe error retrieving customer ${customerId}: ${error.message}`, error.stack);
                return { message: "An error occured while trying to retrieve your stripe account", success: false, error: error.message };
            } else {
                this.logger.error(`Unexpected error retrieving customer ${customerId}: ${error.message}`, error.stack);
                return { message: "An unexpected error occurred", success: false, error: error.message };
            }
        }
    }
    async updateCustomer(customerId: string, data: Stripe.CustomerUpdateParams) {
        try {
            this.logger.log(`Updating customer with ID: ${customerId}`);
            
            const customer = await this.stripeService.customers.update(customerId, data);
            
            this.logger.log(`Customer updated successfully: ${customerId}`);
            return { message: "Customer updated successfully", success: true, customer: customer };
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                this.logger.error(`Stripe error updating customer ${customerId}: ${error.message}`, error.stack);
                return { message: "An error occured while trying to update your stripe account", success: false, error: error.message };
            } else {
                this.logger.error(`Unexpected error updating customer ${customerId}: ${error.message}`, error.stack);
                return { message: "An unexpected error occurred", success: false, error: error.message };
            }
        }
    }
}