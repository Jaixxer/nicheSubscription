import { Injectable } from "@nestjs/common";
import { PrismaService } from "apps/api-gateway/prisma/prisma.service";
import { BoxItemDto } from "libs/common/dtos/dto.box-item";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BoxItemCommandRepository{
    constructor(private prismaService:PrismaService){}
    async createBoxItem(data): Promise<any> {
        try {
          const item= await this.prismaService.boxItem.create({
            data: {
                productId: data.productId,
                name: data.name,
                quantity: data.quantity,
                description: data.description,
            },
        });  
        return item
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // Unique constraint failed
                    throw new Error('Box item with this name already exists for the product.');
                }
                throw error
            }
            // Add a fallback return or rethrow to satisfy the return type
            console.log(error.message)
            throw new Error('Failed to create box item.');
        }
    }
    async remove(boxItemId: string): Promise<Error | object> {
        try {
            await this.prismaService.boxItem.delete({
                where: { id: boxItemId },
            });
            return { message: 'Box item removed successfully' };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    // Record to delete does not exist
                    return new Error('Box item not found.');
                }
                return error;
            }
            return {message: 'Failed to remove box item.'};
            

        }
    }
    async updateBoxItem(data): Promise<any> {
        try {
            return await this.prismaService.boxItem.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    quantity: data.quantity,
                    description: data.description,
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    // Record to update does not exist
                    throw new Error('Box item not found.');
                }
                throw error;
            }
            throw new Error('Failed to update box item.');
        }
    }
}