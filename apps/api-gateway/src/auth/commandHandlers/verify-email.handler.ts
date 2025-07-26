import { CommandHandler } from "@nestjs/cqrs";
import { ICommandHandler } from "@nestjs/cqrs";
import { VerifyEmailCommand } from "../commands/verify-email.command";
import { AuthRepository } from "../repositories/auth.repository";
import { TokenService } from "../services/token.service";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly tokenService: TokenService,
        @Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy,
        
    ) {}

    async execute(command: VerifyEmailCommand): Promise<any> {
        const { userId, email, emailToken,firstName } = command;

        if (!userId || !email || !emailToken) {
            throw new Error("Invalid Request!");
        }

        // Verify the email token
        const verifiedToken = await this.tokenService.verifyToken(emailToken);
        if (!verifiedToken ) {
            throw new Error("Invalid or expired email verification token");
        }

        // Update the user's email verification status in the repository
        await this.authRepository.verifyEmail(userId);

        // Notify the user about successful email verification
        this.notificationService.emit('email.verification.success', { email, firstName });
        
        return { success: true, message: "Email verified successfully" };
    }
}