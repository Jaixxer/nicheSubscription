import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api-gateway/prisma/prisma.service';

@Injectable()
export class BoxItemQueryRepository {
    constructor(private readonly prismaService:PrismaService) {}
    async getBoxItemsByProductId(productId: string) {
        return this.prismaService.boxItem.findMany({
            where: { productId },
            
        });
    }
    async findById(boxItemId: string) {
        return this.prismaService.boxItem.findFirst({
            where: {
                id: boxItemId,
            },
            select: {
                id: true,
                product: {
                    select: {
                        id: true
                        ,curatorId: true,
                    }},
                    name:true,
                    description: true,
                    quantity: true,
                }

        });
    }
}
