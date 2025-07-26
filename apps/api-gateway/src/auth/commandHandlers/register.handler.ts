import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCommand } from "../commands/register.command";
import { AuthRepository } from "../repositories/auth.repository";
import { PasswordService } from "../services/password.service";
import { TokenService } from "../services/token.service";
import { Injectable } from "@nestjs/common";

@Injectable()
@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) {}

    async execute(command: RegisterCommand): Promise<any> {
        const { email, password, roles, phone, firstName, lastName } = command;

        // Hash the password
        const hashedPassword = await this.passwordService.hashPassword(password);

        // Create the user
        const user = await this.authRepository.createUser(
            email,
            hashedPassword,
            roles,
            phone,
            firstName,
            lastName
        );

        if (!user) {
            throw new Error('User creation failed');
        }

        // Generate tokens
        const tokens = await this.tokenService.generateToken(user.id, user.email);
        
        return {
            user,
            ...tokens
        };
    }
}