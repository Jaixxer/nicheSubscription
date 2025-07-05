import { Controller, Post, UseGuards, Get,Req, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { CreateSubscriptionCommand,UpdateSubscriptionCommand ,CancelSubscriptionCommand} from './command/index';
import { GetSubscriptionByUserQuery } from './queries/index';
@Controller('subscription')
export class SubscriptionController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) { }
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createSubscription(@Req() req, @Body() dto) {
        try {
            const subscriberId = req.user.id;
            const { productId, status, chosenPlan, quantity, autoRenew } = dto;
            if (!productId || !chosenPlan || !quantity) {
                return { message: "Required fields are missing." };
            }
            const command = await this.commandBus.execute(new CreateSubscriptionCommand(
                subscriberId,
                productId,
                status,
                chosenPlan,
                quantity,
                autoRenew
            ));
            return { message: "Subscription created successfully", subscription: command.subscription };
        } catch (error) {
            console.error('Error creating subscription:', error);
            return { message: "Failed to create subscription", error: error.message };
        }
    }
    @Post('update')
    @UseGuards(AuthGuard('jwt'))
    async updateSubscription(@Req() req,@Body() dto) {
        try {
            const user = req.user.id;
            const { subscriptionId, autoRenew, status, chosenPlan, quantity } = dto;
            if (!subscriptionId) {
                return { message: "Subscription ID is required." };
            }
            const command = await this.commandBus.execute(new UpdateSubscriptionCommand(
                user,
                subscriptionId,
                autoRenew,
                status,
                chosenPlan,
                quantity
            ));
            return { message: "Subscription updated successfully", subscription: command };
        } catch (error) {
            console.error('Error updating subscription:', error);
            return { message: "Failed to update subscription", error: error.message };
        }
    }
    @Get('get-by-user')
    @UseGuards(AuthGuard('jwt'))
    async getSubscriptionByUser(@Req() req) {
        try {
            const subscriberId = req.user.id;
            const query = await this.queryBus.execute(new GetSubscriptionByUserQuery(subscriberId));
            return { message: "Subscriptions retrieved successfully", subscriptions: query };
        } catch (error) {
            console.error('Error retrieving subscriptions:', error);
            return { message: "Failed to retrieve subscriptions", error: error.message };
        }
    }
    @Post('cancel/:subscriptionId')
    @UseGuards(AuthGuard('jwt'))
    async cancelSubscription(@Req() req, @Param('subscriptionId') subscriptionId: string) {
       const user = req.user.id
        try {
            const command = await this.commandBus.execute(new CancelSubscriptionCommand(subscriptionId,user));
            return { message: "Subscription cancelled successfully", response: command };
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            return { message: "Failed to cancel subscription", error: error.message };
        }
    }
}
