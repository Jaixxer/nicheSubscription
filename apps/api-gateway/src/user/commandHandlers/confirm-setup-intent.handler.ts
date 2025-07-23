import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConfirmSetupIntentCommand } from "../commands/confrim-setup-intent.command";
import { UserRepository } from '../repositories/user.repository';
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@CommandHandler(ConfirmSetupIntentCommand)
export class ConfirmSetupIntentCommandHandler implements ICommandHandler<ConfirmSetupIntentCommand> {
    private readonly logger = new Logger(ConfirmSetupIntentCommandHandler.name);

    constructor(
        private readonly userRepository: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) {}

    async execute(command: ConfirmSetupIntentCommand): Promise<any> {
        try {
            // Get user with stripeId from database
            const userStripeId = await this.userRepository.checkUserStripeId(command.userId);
            if (!userStripeId) {
                throw new Error('User does not have a Stripe customer ID');
            }

            const confirmData = {
                setupIntentId: command.setupIntentId,
                paymentMethodId: command.paymentMethodId,
                stripeCustomerId: userStripeId
            };

            this.logger.log(`Sending setup.intent.confirmed message for setupIntentId: ${command.setupIntentId}`);
            
            const billingResponse = await lastValueFrom(
                this.billingClient.send('setup.intent.confirmed', confirmData)
            );
            
            console.log('Billing service response for setup.intent.confirmed:', billingResponse);
            
            if (!billingResponse || !billingResponse.success) {
                throw new Error(`Failed to confirm setup intent: ${billingResponse?.error || 'Unknown error'}`);
            }

            this.logger.log(`Setup intent confirmed for setupIntentId: ${command.setupIntentId}`);
            return billingResponse;
        } catch (error) {
            console.error('Failed to confirm setup intent:', error);
            this.logger.error(`Error confirming setup intent for setupIntentId: ${command.setupIntentId}:`, error);
            throw error;
        }
    }
}