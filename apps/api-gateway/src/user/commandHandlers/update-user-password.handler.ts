import { CommandHandler ,ICommandHandler} from "@nestjs/cqrs";
import { UpdateUserPasswordCommand } from "../commands/index";
import * as argon2 from "argon2";
import { UserRepository } from "../repositories/user.repository";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
    private readonly logger = new Logger(UpdateUserPasswordHandler.name);

    constructor(
        private readonly userRepo: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) { }
    async execute(command: UpdateUserPasswordCommand): Promise<any> {
        const { id, oldPassword, newPassword } = command;
        console.log(id, oldPassword, newPassword);
        const user = await this.userRepo.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await argon2.verify(user.password, oldPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        user.password = await argon2.hash(newPassword);
        const result = await this.userRepo.updateUserPassword(id, user.password);

        // Emit event to billing service
        try {
            this.billingClient.emit('user.password.updated', {
                userId: id,
                updatedAt: new Date()
            });
        } catch (error) {
            this.logger.error('Failed to emit user.password.updated event:', error);
        }

        return result;
    }
}