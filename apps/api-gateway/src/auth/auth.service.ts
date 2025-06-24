import { Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../../../../libs/common/dtos/index';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(private user: UserService,private jwtService: JwtService,private config: ConfigService) { }
    async signup(dto: SignUpDto) {
        const password = dto.password;
        const hash = await argon2.hash(password);
        dto.password = hash;
        const user = await this.user.createuser(dto);
        if (!user) {
            throw new Error('User creation failed');
        }
        const token = await this.generateToken(user.id, user.email);
        return (token);

    }
    async login(dto: LoginDto) {
        const user = await this.user.findUser(dto.email);
        if (!user) {
            throw new Error('Credentials are incorrect');
        }
        const isPasswordValid = await argon2.verify(user.password, dto.password);
        if (!isPasswordValid) {
            throw new Error('Credentials are incorrect');
        }
        const token = await this.generateToken(user.id, user.email);
        return (token);
    }

    async generateAccessToken(id: string, email:string){
        const payload = {
            sub: id,
            email: email
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: this.config.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '15min' // Token expiration time
        });
        return{
            access_token:token
        }
    }
    async generateToken(id:string,email:string) {
        const accessToken = await this.generateAccessToken(id, email);
        const refreshToken = await this.generateRefreshToken(id, email);
        return {
            ...accessToken,
            ...refreshToken
        };
    }
    async generateRefreshToken(id:string,email:string) {
        const payload = {
            sub: id,
            email: email
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d' // Refresh token expiration time
        });
        return {
            refresh_token: token
        }
    }
    async refreshAccessToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.get<string>('JWT_ACCESS_SECRET'),
            });
            if (!payload || !payload.sub || !payload.email) {
                throw new Error('Invalid token');
            }
            const newAccessToken = await this.generateAccessToken(payload.sub, payload.email);
            return newAccessToken;
        }
            catch (error) {
            throw new Error('Invalid refresh token');
            }
}}
