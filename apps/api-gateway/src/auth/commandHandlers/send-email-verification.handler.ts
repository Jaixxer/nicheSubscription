import { CommandHandler } from "@nestjs/cqrs";
import { ICommandHandler } from "@nestjs/cqrs";
import { SendEmailVerificationCommand } from "../commands/send-email-verification.command";
import { TokenService } from "../services/token.service";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
@CommandHandler(SendEmailVerificationCommand)
export class SendEmailVerificationHandler implements ICommandHandler<SendEmailVerificationCommand> {
    constructor(private readonly tokenService: TokenService, @Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy) {}

    async execute(command: SendEmailVerificationCommand): Promise<any> {
        const { userId, name, email } = command;
        if (!userId || !email) {
            throw new Error("Invalid Request!");
        }
        
        const token = await this.tokenService.generateEmailVerificationToken(userId);
        const link = `http://localhost:3000/verify-email?token=${token}`;
        this.notificationService.emit('email.verification.sent', { "to": email, "name": name, "link": link });
    }
}