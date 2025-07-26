import { ICommandHandler,CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { AuthRepository } from '../repositories/auth.repository';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(private readonly authRepository: AuthRepository,private readonly passService: PasswordService,
        private readonly tokenService: TokenService
    ) {}

    async execute(command: LoginCommand): Promise<any> {
        const { id, password,hashPassword } = command;
        
        const verification = await this.passService.verifyPassword(password,hashPassword);
        if (!verification) {
            throw new Error('Invalid password');
        }
        const access_token = await this.tokenService.generateAccessToken(id);
        const refresh_token = await this.tokenService.generateRefreshToken(id);

        return {
            success:true,
            access_token,
            refresh_token,
        }

         
    }
}