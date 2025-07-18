import { Controller, Injectable, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { StripeCustomerService } from '../../stripe/customers/stripe-customers.service';
import { CreateCustomerDto } from '../../stripe/customers/dto.stripe-customers';
import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  CustomerRetrievedEvent,
  ConnectedAccountCreatedEvent,
} from '../dto/incoming-events.dto';

@Controller()
export class CustomerEventsConsumer {
  private readonly logger = new Logger(CustomerEventsConsumer.name);

  constructor(
    private readonly stripeCustomerService: StripeCustomerService,
  ) {}

  @EventPattern('customer.created')
  async handleCustomerCreated(data: CustomerCreatedEvent) {
    try {
      this.logger.log(`Processing CustomerCreated event for customerId: ${data.customerId}`);

      const customerResult = await this.stripeCustomerService.createCustomer({
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
        shipping: data.shipping,
      } as CreateCustomerDto);

      if (!customerResult || !customerResult.success || !customerResult.customer) {
        throw new Error(`Failed to create Stripe customer: ${customerResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed CustomerCreated event for customerId: ${data.customerId}`);
      return {
        success: true,
        customerId: data.customerId,
        stripeCustomerId: customerResult.customer.id,
      };

    } catch (error) {
      this.logger.error(`Error processing CustomerCreated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('customer.updated')
  async handleCustomerUpdated(data: CustomerUpdatedEvent) {
    try {
      this.logger.log(`Processing CustomerUpdated event for customerId: ${data.customerId}`);

      const updateData: any = {};
      if (data.email) updateData.email = data.email;
      if (data.name) updateData.name = data.name;
      if (data.phone) updateData.phone = data.phone;
      if (data.address) updateData.address = data.address;
      if (data.shipping) updateData.shipping = data.shipping;

      const customerResult = await this.stripeCustomerService.updateCustomer(
        data.stripeCustomerId,
        updateData
      );

      if (!customerResult || !customerResult.success) {
        throw new Error(`Failed to update Stripe customer: ${customerResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed CustomerUpdated event for customerId: ${data.customerId}`);
      return {
        success: true,
        customerId: data.customerId,
        stripeCustomerId: data.stripeCustomerId,
      };

    } catch (error) {
      this.logger.error(`Error processing CustomerUpdated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('customer.retrieved')
  async handleCustomerRetrieved(data: CustomerRetrievedEvent) {
    try {
      this.logger.log(`Processing CustomerRetrieved event for customerId: ${data.customerId}`);

      const customerResult = await this.stripeCustomerService.getCustomer(data.stripeCustomerId);

      if (!customerResult || !customerResult.success) {
        throw new Error(`Failed to retrieve Stripe customer: ${customerResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed CustomerRetrieved event for customerId: ${data.customerId}`);
      return {
        success: true,
        customerId: data.customerId,
        stripeCustomerId: data.stripeCustomerId,
        customer: customerResult.customer,
      };

    } catch (error) {
      this.logger.error(`Error processing CustomerRetrieved event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @MessagePattern('connected.account.created')
  async handleConnectedAccountCreated(data: ConnectedAccountCreatedEvent) {
    try {
        
      this.logger.log(`Processing ConnectedAccountCreated event for curatorId: ${data.curatorId}`);

      const accountResult = await this.stripeCustomerService.createConnectedAccount(data.email);

      if (!accountResult || !accountResult.success || !accountResult.account) {
        throw new Error(`Failed to create connected account: ${accountResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed ConnectedAccountCreated event for curatorId: ${data.curatorId}`);
      return {
        success: true,
        curatorId: data.curatorId,
        stripeAccountId: accountResult.account.id,
        accountLink: accountResult.accountLink,
      };

    } catch (error) {
      this.logger.error(`Error processing ConnectedAccountCreated event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
