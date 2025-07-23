import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSetupIntentCommand } from "../commands/create-setup-intent.command";
import { UserRepository } from '../repositories/user.repository';
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@CommandHandler(CreateSetupIntentCommand)
export class CreateSetupIntentHandler implements ICommandHandler<CreateSetupIntentCommand> {
    private readonly logger = new Logger(CreateSetupIntentHandler.name);

    constructor(
        private readonly userRepository: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) {}

    async execute(command: CreateSetupIntentCommand): Promise<any> {
        try {
            // Get user with stripeId from database
            const userStripeId = await this.userRepository.checkUserStripeId(command.customerId);
            if (!userStripeId) {
                throw new Error('User does not have a Stripe customer ID');
            }

            const setupIntentData = {
                customerId: command.customerId,
                stripeCustomerId: userStripeId,
                
            };

            const billingResponse = await lastValueFrom(
                this.billingClient.send('setup.intent.created', setupIntentData)
            );
            
            console.log('Billing service response for setup.intent.created:', billingResponse);
            this.logger.log(`Setup intent created for customerId: ${command.customerId}`);
            
            return billingResponse;
        } catch (error) {
            console.error('Failed to create setup intent:', error);
            throw error;
        }
    }
}
