import {ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { ResetUserPasswordCommand } from "../../user/commands/reset-user-password.command";
import { UserRepository } from "../../user/repositories/user.repository";

@CommandHandler(ResetUserPasswordCommand)
export class ResetUserPasswordHandler implements ICommandHandler<ResetUserPasswordCommand> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: ResetUserPasswordCommand): Promise<void> {
        const { id, newPassword, resetToken } = command; 
        if(resetToken === undefined || resetToken === null || resetToken.trim() === '') {
            throw new Error("Reset token is required");
        }
        if(newPassword === undefined || newPassword === null || newPassword.trim() === '') {
            throw new Error("New password is required");
        }
        // Update the user's password
        await this.userRepository.updateUserPassword(id, newPassword);

        // Optionally, you might want to invalidate the reset token after use
        // This could be done by removing it from the database or marking it as used
    }
}
