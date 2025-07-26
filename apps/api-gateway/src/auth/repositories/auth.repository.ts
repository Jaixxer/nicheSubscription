import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "apps/api-gateway/prisma/prisma.service";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) { }
    async getCredentials(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true }
        });
    
    }

    async addPhoneNumber(userId: string, phoneNumber: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { phone: phoneNumber, phoneVerified: false },
            select: { id: true, phone: true, phoneVerified: true }
        });
    }
    async verifyPhoneNumber(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { phoneVerified: true },
            select: { id: true, phone: true, phoneVerified: true }
        });
    }
    async verifyEmail(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true },
            select: { id: true, email: true, emailVerified: true }
        });
    }

    async createUser(email: string, hashedPassword: string, roles: string[], phone?: string, firstName?: string, lastName?: string) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    ...(firstName && { firstName: firstName }),
                    ...(lastName && { lastName: lastName }),
                    ...(phone && { phone: phone })
                },
                select: {
                    id: true,
                    email: true,
                }
            });

            if (user) {
                const roleIds = await this.getRolesId(roles);
                const createRoles = await this.setUserRole(user.id, roleIds);
                if (createRoles) {
                    const result = {
                        ...user,
                        role: roles
                    };
                    return result;
                }
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002') {
                    throw new ForbiddenException("Email Already Exists");
                }
            }
            throw error;
        }
    }

    async setUserRole(userId: string, roleIds: number[]) {
        try {
            const payload = roleIds.map(roleId => ({
                userId: userId,
                roleId: roleId,
            }));
            console.log(payload);
            const setRole = await this.prisma.userRole.createMany({
                data: payload
            });
            if (!setRole) {
                throw Error;
            }
            console.log("Roles added successfully!");
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    async getRolesId(role: string[]): Promise<number[]> {
        try {
            console.log("Fetching roles for:", role);
            const roles = await this.prisma.role.findMany({
                where: {
                    OR: role.map(r => ({ role: r }))
                },
                select: {
                    id: true
                }
            });
            if (!roles || roles.length == 0) {
                throw new Error(`No roles found for: ${role}`);
            }
            return roles.map(role => role.id);
        } catch (error) {
            throw error;
        }
    }
}