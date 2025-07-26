import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../../../../libs/common/dtos/index';
import { QueryBus, EventBus, CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from './commands/register.command';
import { FetchPasswordQuery } from './queries/fetch-password.query';
import { LoginCommand } from './commands/login.command';
import { AuthGuard } from '@nestjs/passport';
import { SendEmailVerificationHandler } from './commandHandlers/send-email-verification.handler';
import { SendEmailVerificationCommand } from './commands/send-email-verification.command';
import { VerifyEmailCommand } from './commands/verify-email.command';
import { SendPhoneVerificationCommand } from './commands/send-phone-verification.command';

@Controller('auth')
export class AuthController {
    constructor(private queryBus: QueryBus, private readonly commandBus: CommandBus) { }
    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return await this.commandBus.execute(new RegisterCommand(dto.email, dto.password, dto.role, dto.phone, dto.firstName, dto.lastName));
    }
    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.queryBus.execute(new FetchPasswordQuery(dto.email));
        if (!user) {
            throw new Error('User not found');
        }
        console.log(user.user);
        return await this.commandBus.execute(new LoginCommand(user.user.id, dto.password, user.user.password));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('send-email')
    async sendEmailVerification(@Req() req) {
        const { id, firstName, email } = req.user
        const startProcess = await this.commandBus.execute(new SendEmailVerificationCommand(id, firstName, email));
        if (!startProcess) {
            throw new Error('Email verification process failed');
        }

        return ({
            startProcess
        })
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('verify-email')
    async verifyEmail(@Req() req: any) {
        const token = req.query.token;
        const { id, firstName, email } = req.user;
        const verifyEmail = await this.commandBus.execute(new VerifyEmailCommand(id, email, token, firstName));
        return verifyEmail;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('send-phone-verification')
    async sendPhoneVerification(@Req() req: any) {
        console.log(req.user);
        const { id, firstName,email, phone } = req.user;
        if (!phone) {
            throw new Error('Phone number is not provided');
        }
        const startProcess = await this.commandBus.execute(new SendPhoneVerificationCommand(id, firstName, phone));
        if (!startProcess) {
            throw new Error('Phone verification process failed');
        }
        return ({
            startProcess
        });
    }

}
