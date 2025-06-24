import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, SignUpDto } from '../auth/dtos';
import { PrismaService } from 'apps/api-gateway/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
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
                select:{
                    id:true,
                    email:true
                }
            })
            if (user){
                const roles = await this.getRolesId(dto.role)
                const createRoles = await this.setUserRole(user.id,roles)
                if(createRoles){
                    return user
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
    async findUser(email:string) {
    const user = await this.prismaClient.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            password: true
        }});
    if(!user) {
        throw new ForbiddenException("User not found");
    }
    return user;
    
}
    async setUserRole(userId: string,roleIds: number[]){
        try {
            const payload = roleIds.map(roleId=>({
                userId:userId,
                roleId:roleId,
            }))
            const setRole = await this.prismaClient.userRole.createMany({
                data: payload
            })
            if(!setRole){
                throw Error
            }
            return true
            console.log("Roles added successfully!")
                
            
        } catch (error) {
            console.log(error)
        }
    }
    async getRolesId(role:string):Promise<number[]>{
        try {
            const roles= await this.prismaClient.role.findMany({
                where:{
                    OR:[
                        {role:'user'},
                        {role:role}
                ]
                },
                select:{
                    id:true
                }
            })
            if(!roles || roles.length==0){
                throw new Error(`No roles found for: ${role}`)
            }
            return roles.map(role=>role.id)

        } catch (error) {
            throw error
        }
    }
}
