import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SignupUserCommand } from "../commands/signup-user.command";
import { AuthRepository } from "../repositories/auth.repository";
import { PasswordService } from "../services/password.service";
import { TokenService } from "../services/token.service";
import { Injectable } from "@nestjs/common";

@Injectable()
@CommandHandler(SignupUserCommand)
export class SignupUserHandler implements ICommandHandler<SignupUserCommand> {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) {}

    async execute(command: SignupUserCommand): Promise<any> {
        const { email, password, role, phone, firstName, lastName } = command;

        // Hash the password
        const hashedPassword = await this.passwordService.hashPassword(password);

        // Create the user
        const user = await this.authRepository.createUser(
            email,
            hashedPassword,
            role,
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