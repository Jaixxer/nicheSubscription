import { Injectable } from "@nestjs/common";
import { PrismaService } from "apps/api-gateway/prisma/prisma.service";
import { SubscriptionDto, UpdateSubscriptionDto } from "libs/common/dtos/dto.subscription";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class SubscriptionCommandRepository {
    constructor(private prismaService: PrismaService) { }
    async createSubscription(
        subscriberId: string, dto: SubscriptionDto
    ): Promise<any> {
        const subscription = await this.prismaService.subscription.create({
            data: {
                subscriberId: subscriberId,
                productId: dto.productId,
                status: dto.status,
                autoRenew: dto.autoRenew,
                chosenPlan: dto.chosenPlan,
                quantity: dto.quantity,
                ...(dto.nextBillingDate && { nextBillingDate: dto.nextBillingDate }), // Example date, adjust as needed
            }
        });
        return subscription;
    }
    async updateSubscription(
        subscriptionId: string,
        dto: UpdateSubscriptionDto
    ): Promise<any> {
        try {
            const updatedSubscription = await this.prismaService.subscription.update({
                where: { id: subscriptionId },
                data: {
                    ...(dto.autoRenew !== undefined && { autoRenew: dto.autoRenew }),
                    ...(dto.status && { status: dto.status }),
                    ...(dto.chosenPlan && { chosenPlan: dto.chosenPlan }),
                    ...(dto.quantity !== undefined && { quantity: dto.quantity }),
                }
            });
            return updatedSubscription;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Subscription not found.');
                }
            }
        }
    }
    async cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
        try {
            await this.prismaService.subscription.update({
                where: { id: subscriptionId },
                data: { status: 'cancelled' }
            });
            return { message: 'Subscription cancelled successfully.' };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Subscription not found.');
                }
            }
            throw error;
        }
    }
    async addSubscriptionStripeId(subscriptionId: string, stripeSubscriptionId: string): Promise<void> {
        try {
            await this.prismaService.subscription.update({
                where: { id: subscriptionId },
                data: { stripeSubscriptionId }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Subscription not found.');
                }
            }
            throw error;
        }
    }
}