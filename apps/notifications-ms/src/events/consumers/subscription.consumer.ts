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

    @EventPattern("welcome.email")
    async handleWelcomeEmail(data: { email: string, phone: string, name: string }) {
        const { email, phone, name } = data;
        await this.notificationService.sendWelcomeEmail(email, name);
        await this.notificationService.sendWelcomeSms(phone, name);
    }
    @EventPattern('verification.email')
    async handleVerificationEmail(data: { email: string, phone: string, name: string, link: string }) {
        const { email, phone, name, link } = data;
        await this.notificationService.sendVerificationEmail(email, name, link);
        await this.notificationService.sendVerificationSms(phone, name, link);
    }
    @EventPattern('password.reset.email')
    async handlePasswordResetEmail(data: { email: string, phone: string, name:
    string, link: string, code: string }) {
            const { email, phone, name, link, code } = data;
            await this.notificationService.sendPasswordResetEmail(email, name, link);
            await this.notificationService.sendPasswordResetSms(phone, name, code);
        }
    
}