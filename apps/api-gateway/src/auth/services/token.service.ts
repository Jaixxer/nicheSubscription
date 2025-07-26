import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

    async generateAccessToken(userId: string): Promise<string> {
        const payload = { sub: userId };
         return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '1h', // Adjust the expiration time as needed
        });
    }
    async generateRefreshToken(userId: string): Promise<string> {
        const payload = { sub: userId };
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '14d', // Adjust the expiration time as needed
        });
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            });
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
    async generateEmailVerificationToken(userId: string): Promise<string> {
        const payload = { sub: userId };
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET') as string,
            expiresIn: '1d', // Adjust the expiration time as needed
        });
    }

    async generateToken(id: string, email: string) {
        const accessToken = await this.generateAccessTokenWithEmail(id, email);
        const refreshToken = await this.generateRefreshTokenWithEmail(id, email);
        return {
            ...accessToken,
            ...refreshToken
        };
    }

    async generateAccessTokenWithEmail(id: string, email: string) {
        const payload = {
            sub: id,
            email: email
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '1d' // Token expiration time
        });
        return {
            access_token: token
        };
    }

    async generateRefreshTokenWithEmail(id: string, email: string) {
        const payload = {
            sub: id,
            email: email
        };
        const token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d' // Refresh token expiration time
        });
        return {
            refresh_token: token
        };
    }
}