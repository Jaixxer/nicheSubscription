import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserProfileCommand } from "../commands/index";
import { UserRepository } from '../repositories/user.repository';
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserProfileCommand> {
    private readonly logger = new Logger(UpdateUserHandler.name);

    constructor(
        private readonly userRepository: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) { }

    async execute(command: UpdateUserProfileCommand): Promise<any> {
        const {id,firstName,lastName,phone}= command;
        console.log(id)
        const user = await this.userRepository.updateUserProfile(id,firstName,lastName,phone  );
        
        // Emit event to billing service
        try {
            this.billingClient.emit('user.profile.updated', {
                userId: id,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                updatedAt: new Date()
            });
        } catch (error) {
            this.logger.error('Failed to emit user.profile.updated event:', error);
        }

        return user;
    }
}