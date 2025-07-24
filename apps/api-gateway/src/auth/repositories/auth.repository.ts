import { Injectable } from "@nestjs/common";
import { PrismaService } from "apps/api-gateway/prisma/prisma.service";
@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) { }
    async getCredentials(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true }
        });

    }
}