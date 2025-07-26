import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import * as CR from 'crypto';
@Injectable()

export class PasswordService {
    constructor() {}

    async hashPassword(password: string): Promise<string> {
        const salt = CR.randomBytes(16)
        return argon2.hash(password,{salt:salt});
    }

    async verifyPassword(password: string, hashPassword: string): Promise<boolean> {
        return argon2.verify(hashPassword, password);
    }
    async generateRandomPassword(length: number = 12): Promise<string> {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    

}