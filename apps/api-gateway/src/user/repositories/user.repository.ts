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
    async getRolesId(role: string): Promise<number[]> {
        try {
            console.log("Fetching roles for:", role)
            const roles = await this.prismaClient.role.findMany({
                where: {
                    OR: [
                        { role: 'User' },
                        { role: role }
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
    async updateUserProfile(id,firstName,lastName,phone){
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
}
