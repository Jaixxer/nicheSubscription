import { CommandHandler,ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserEmailCommand } from "../commands/update-user-email.command";
import * as argon2 from "argon2";
import { UserRepository } from "../repositories/user.repository";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(UpdateUserEmailCommand)
export class UpdaterUserEmailHandler implements ICommandHandler<UpdateUserEmailCommand> {
    private readonly logger = new Logger(UpdaterUserEmailHandler.name);

    constructor(
        private readonly userRepo: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) { }
    async execute(command: UpdateUserEmailCommand): Promise<any> {
        const { id,password,newEmail } = command;

        const user = await this.userRepo.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
      
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            console.log(isPasswordValid)    
            throw new Error('Invalid password');
        }
        user.email = newEmail;
        const result = await this.userRepo.updateUserEmail(id,newEmail);

        // Emit event to billing service
        try {
            this.billingClient.emit('user.email.updated', {
                userId: id,
                oldEmail: user.email,
                newEmail: newEmail,
                updatedAt: new Date()
            });
        } catch (error) {
            this.logger.error('Failed to emit user.email.updated event:', error);
        }

        return result
    }
}

