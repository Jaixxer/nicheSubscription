import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../../../../../libs/common/dtos/dto.auth';
import { PrismaService } from 'apps/api-gateway/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {  UpdateUserProfileDto } from 'libs/common/dtos/dto.user';

@Injectable()
export class UserRepository {
    constructor(private prismaClient: PrismaService) { }
    async createuser(dto: SignUpDto) {
        try {
            const user = await this.prismaClient.user.create({
                data: {
                    email: dto.email,
                    password: dto.password,
                    ...(dto.firstName && { firstName: dto.firstName }),
                    ...(dto.lastName && { lastName: dto.lastName })
                },
                select: {
                    id: true,
                    email: true,

                }
            })
            if (user) {
                const roles = await this.getRolesId(dto.role)
                const createRoles = await this.setUserRole(user.id, roles)
                if (createRoles) {
                    const result = {
                        ...user,
                        role: dto.role
                    }
                    return result
                }

            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002') {
                    throw new ForbiddenException("Email Already Exists")
                }
            }
            throw error
        }

    }
    async findUser(email: string) {
        const user = await this.prismaClient.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                password: true
            }
        });
        if (!user) {
            throw new ForbiddenException("User not found");
        }
        return user;

    }
    async setUserRole(userId: string, roleIds: number[]) {
        try {
            const payload = roleIds.map(roleId => ({
                userId: userId,
                roleId: roleId,
            }))
            console.log(payload)
            const setRole = await this.prismaClient.userRole.createMany({
                data: payload
            })
            if (!setRole) {
                throw Error
            }
            console.log("Roles added successfully!")
            return true


        } catch (error) {
            console.log(error)
        }
    }
    async getRolesId(role: string[]): Promise<number[]> {
        try {
            console.log("Fetching roles for:", role)
            const roles = await this.prismaClient.role.findMany({
                where: {
                    OR: [
                        { role: role[0] },
                        { role: role[1] }
                    ]
                },
                select: {
                    id: true
                }
            })
            if (!roles || roles.length == 0) {
                throw new Error(`No roles found for: ${role}`)
            }
            return roles.map(role => role.id)

        } catch (error) {
            throw error
        }
    }
    async updateUserProfile(id,firstName?:string,lastName?:string,phone?:string){
        try {
            const user = await this.prismaClient.user.update({
                where: {
                    id:id
                },
                data: {
                    ...(phone && { phone: phone }),
                    ...(firstName && { firstName: firstName }),
                    ...(lastName && { lastName: lastName })
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    firstName: true,
                    lastName: true
                }
            });
            return user;
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw new ForbiddenException("Failed to update user profile");
        }
    }
    async findUserById(id: string) {
        const user = await this.prismaClient.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                password: true,
            }
        });
        if (!user) {
            throw new ForbiddenException("User not found");
        }
        return user;
    }
    async updateUserEmail(id: string, email: string) {
        try {
            const user = await this.prismaClient.user.update({
                where: {
                    id: id
                },
                data: {
                    email: email
                },
                select: {
                    id: true,
                    email: true
                }
            });
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == 'P2002') {
                    throw new ForbiddenException("Email Already Exists")
                }
            }
            throw error;
        }
    }
    async updateUserPassword(id: string, password: string) {
        try {
            const user = await this.prismaClient.user.update({
                where: {
                    id: id
                },
                data: {
                    password: password
                },
                select: {
                    id: true,
                    email: true
                }
            });
            return user;
        } catch (error) {
            console.error("Error updating user password:", error);
            throw new ForbiddenException("Failed to update user password");
        }
    }
    async checkUserStripeId(userId: string): Promise<String | null> {
        try {
            const user = await this.prismaClient.user.findUnique({
                where: { id: userId },
                select: { stripeId: true }
            });
            if (!user) {
                return null
            }
            return user.stripeId
        } catch (error) {
            console.error("Error checking user Stripe ID:", error);
            throw new ForbiddenException("Failed to check user Stripe ID");
        }
    }
    async addUserStripeId(userId: string, stripeId: string): Promise<boolean> {
        try {
            const user = await this.prismaClient.user.update({
                where: { id: userId },
                data: { stripeId: stripeId }
            });
            return !!user;
        } catch (error) {
            console.error("Error adding user Stripe ID:", error);
            throw new ForbiddenException("Failed to add user Stripe ID");
        }
    }
    async searchUsers(params: {
        email?: string;
        role?: string;
        firstName?: string;
        lastName?: string;
        isActive?: boolean;
        subscription?:string,
        BillingStartDate?:Date,
        BillingEndDate?:Date,
        offset?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<any[]> {
        const {
            email,
            role,
            firstName,
            lastName,
            isActive,
            subscription,
            BillingStartDate,
            BillingEndDate,
            offset ,
            limit ,
            sortBy ,
            sortOrder
        } = params;

        const where: any = {};
        if (email) where.email = { contains: email, mode: 'insensitive' };
        if (role) where.roles = { some: { role: role } };
        if (firstName) where.firstName = { contains: firstName, mode: 'insensitive' };
        if (lastName) where.lastName = { contains: lastName, mode: 'insensitive' };
        if (isActive !== undefined) where.isActive = isActive;
        if (subscription) where.subscription = { contains: subscription, mode: 'insensitive' };
        if (BillingStartDate && BillingEndDate) {
            where.nextBillingDate = {
                gte: BillingStartDate,
                lte: BillingEndDate
            };
        } 

        const users = await this.prismaClient.user.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: {
                [sortBy as string]: sortOrder
            },
            include: {
                userRoles: {
                    select: {
                        role: true
                    }
                }
            }
        });

        return users;
    }
    async changeUserStatus(id: string) {
        try {
            // Fetch current user to get current isActive value
            const currentUser = await this.prismaClient.user.findUnique({
                where: { id: id },
                select: { isActive: true }
            });
            if (!currentUser) {
                throw new ForbiddenException("User not found");
            }
            const user = await this.prismaClient.user.update({
                where: { id: id },
                data: { isActive: !currentUser.isActive },
                select: {
                    id: true,
                    email: true,
                    isActive: true
                }
            });
            return user;
        } catch (error) {
            console.error("Error changing user status:", error);
            throw new ForbiddenException("Failed to change user status");
        }
    }
}
