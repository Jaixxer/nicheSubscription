import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateConnectedAccountCommand } from "../commands/index";
import { UserRepository } from "../repositories/user.repository";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, lastValueFrom } from 'rxjs';
@CommandHandler(CreateConnectedAccountCommand)
export class CreateConnectedAccountHandler implements ICommandHandler<CreateConnectedAccountCommand> {
    private readonly logger = new Logger(CreateConnectedAccountHandler.name);

    constructor(
        private readonly userRepository: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) { }

    async execute(command: CreateConnectedAccountCommand): Promise<any> {
        const { curatorId, email } = command;
        const info = {
            curatorId,
            email
        };
        try {
            const data: any =  await lastValueFrom(this.billingService.send('connected.account.created', {curatorId,email}))
            console.log("data", data);
            if (data && data.stripeAccountId) {
                this.logger.log(`Connected account created successfully for curatorId: ${curatorId}`);
                const addStripeId = await this.userRepository.addUserStripeId(curatorId, data.stripeAccountId);
                if (!addStripeId) {
                    this.logger.error(`Failed to add Stripe ID for curatorId: ${curatorId}`);
                    throw new Error(`Failed to add Stripe ID for curatorId: ${curatorId}`);
                }
            }
        } catch (error) {
            this.logger.error(`Failed to emit connected account creation event: ${error.message}`, error.stack);
        }
    }
}
