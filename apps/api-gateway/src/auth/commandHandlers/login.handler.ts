import { ICommandHandler,CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { AuthRepository } from '../repositories/auth.repository';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(command: LoginCommand): Promise<any> {
        const { email, password } = command;
        

        return this.authRepository.login(email, password);
    }
}