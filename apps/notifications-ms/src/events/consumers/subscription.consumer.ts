import { Controller } from '@nestjs/common';
import { EventPattern,MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './../../services/notification.service';
@Controller()
export class SubscriptionConsumer{
    constructor(private readonly notificationService:NotificationService) {}
    
    @EventPattern('subscription.created')
    async handleSubscriptionCreated(data: { email: string, phone: string, plan: string, name: string, subscriptionName: string, cost: string, frequency: string }) {
        const { email, phone, name, subscriptionName, cost, frequency } = data;
        await this.notificationService.sendSubscriptionBoughtEmail(email, name, subscriptionName, cost, frequency);
        await this.notificationService.sendSubscriptionBoughtSms(phone, name, subscriptionName, cost, frequency);
    }
    

    
}