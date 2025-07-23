import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api-gateway/prisma/prisma.service';
import { stat } from 'fs';

@Injectable()
export class SubscriptionQueryRepository {
    constructor(private readonly prismaService: PrismaService){}
    async getBookedStockForProduct(productId: string): Promise<number> {
        const result = await this.prismaService.subscription.aggregate({
            _sum: { quantity: true },
            where: { productId, status: 'active' } });
        return result._sum.quantity ?? 0;
    }
    async getSubscriptionById(subscriptionId: string) {
        return this.prismaService.subscription.findUnique({
            where: { id: subscriptionId },
            select:{
                id: true,
                subscriberId: true,
                productId: true,
                status: true,
                autoRenew: true,
                chosenPlan: true,
                quantity: true,
                createdAt: true,
                updatedAt: true,
            
            }
        });
    }
    async getSubscriptions(status, limit?: number , page?: number ) {
        const take = limit || 10;
        const skip = page ? (page - 1) * take : 0;
        if (status ==='all'){
            status = undefined; // If 'all', we don't filter by status
        }
        return this.prismaService.subscription.findMany({
            where:{
                ...(status ? { status } : {}),
            },
            take,
            skip,
            select: {
                id: true,
                subscriberId: true,
                productId: true,
                status: true,
                autoRenew: true,
                chosenPlan: true,
                quantity: true,
                nextBillingDate: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getSubscriptionByUser(subscriberId: string) {
        return this.prismaService.subscription.findMany({
            where: { subscriberId },
            select: {
                id: true,
                productId: true,
                status: true,
                autoRenew: true,
                chosenPlan: true,
                quantity: true,
                nextBillingDate: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
}
