import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../../../../libs/common/dtos/index';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return this.authService.signup(dto)
    }
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }
}
