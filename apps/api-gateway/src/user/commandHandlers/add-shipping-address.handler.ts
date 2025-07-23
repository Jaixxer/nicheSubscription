import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddShippingAddressCommand } from "../commands/add-shipping-address.command";
import { UserRepository } from '../repositories/user.repository';
import { Inject, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(AddShippingAddressCommand)
export class AddShippingAddressHandler implements ICommandHandler<AddShippingAddressCommand> {
    private readonly logger = new Logger(AddShippingAddressHandler.name);

    constructor(
        private readonly userRepository: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) {}

    async execute(command: AddShippingAddressCommand): Promise<any> {
        try {
            const addShippingAddress = await this.

            const addressData = {
                userId: command.userId,
                ...command.address
            };

            this.logger.log(`Adding shipping address for userId: ${command.userId}`);
            
            const billingResponse = await lastValueFrom(
                this.billingClient.send('shipping.address.added', addressData)
            );
            
            console.log('Billing service response for shipping.address.added:', billingResponse);
            
            if (!billingResponse || !billingResponse.success) {
                throw new Error(`Failed to add shipping address: ${billingResponse?.error || 'Unknown error'}`);
            }

            this.logger.log(`Shipping address added for userId: ${command.userId}`);
            return billingResponse;
        } catch (error) {
            console.error('Failed to add shipping address:', error);
            this.logger.error(`Error adding shipping address for userId: ${command.userId}:`, error);
            throw error;
        }
    }
}
