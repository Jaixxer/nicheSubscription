import { NotificationTemplates } from './template.service';
import { EmailProvider } from '../providers/email.provider';
import { SmsProvider } from '../providers/sms.provider';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationService {

    constructor(    private readonly emailProvider: EmailProvider,
    private readonly smsProvider: SmsProvider
) {
    }

    async sendVerificationEmail(to: string, name: string, link: string): Promise<void> {
        const { subject, html } = NotificationTemplates.verifyEmail(name, link);
        await this.emailProvider.sendEmail(to, subject, html);
        return Promise.resolve();
    }

    async sendPhoneVerificationSms(to: string, name: string, code: number): Promise<void> {
        const { message } = NotificationTemplates.verifyPhone(name, code);
        await this.smsProvider.sendSms(to, message);
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        const { subject, html } = NotificationTemplates.emailVerifiedAndWelcome(name);
        await this.emailProvider.sendEmail(to, subject, html);
    }

    async sendWelcomeSms(to: string, name: string): Promise<void> {
        const message = `Welcome to our service, ${name}! Your email has been verified.`;
        await this.smsProvider.sendSms(to, message);
    }

    async sendPasswordResetEmail(to: string, name: string, link: string): Promise<void> {
        const { subject, html } = NotificationTemplates.passwordReset(name, link);
        await this.emailProvider.sendEmail(to, subject, html);
    }

    async sendPasswordResetSms(to: string, name: string, code: string): Promise<void> {
        const message = `Hi ${name}, use this code to reset your password: ${code}`;
        await this.smsProvider.sendSms(to, message);
    }

    async sendSubscriptionBoughtEmail(to: string, name: string, subscriptionName: string,cost:string,frequency:string): Promise<void> {
        const { subject, html } = NotificationTemplates.subscriptionBought(name,subscriptionName,cost,frequency);
        await this.emailProvider.sendEmail(to, subject, html);
    }
    async sendSubscriptionBoughtSms(
        to: string,
        name: string,
        subscriptionName: string,
        cost: string,
        frequency: string
    ): Promise<void> {
        const message = `Hi ${name}, you have successfully purchased the "${subscriptionName}" subscription for ${cost} (${frequency}).`;
        await this.smsProvider.sendSms(to, message);
    }

    async sendSubscriptionCancelledEmail(to: string, name: string, subscriptionName: string): Promise<void> {
        const { subject, html } = NotificationTemplates.subscriptionCancelled(name, subscriptionName);
        await this.emailProvider.sendEmail(to, subject, html);
    }

    async sendSubscriptionCancelledSms(to: string, name: string, subscriptionName: string): Promise<void> {
        const message = `Hi ${name}, your subscription (${subscriptionName}) has been cancelled.`;
        await this.smsProvider.sendSms(to, message);
    }

    async sendPaymentMethodAddedEmail(to: string, name: string, paymentMethod: string): Promise<void> {
        const { subject, html } = NotificationTemplates.paymentMethodAdded(name, paymentMethod);
        await this.emailProvider.sendEmail(to, subject, html);
    }

    async sendPaymentMethodAddedSms(to: string, name: string, paymentMethod: string): Promise<void> {
        const message = `Hi ${name}, your payment method (${paymentMethod}) was added successfully.`;
        await this.smsProvider.sendSms(to, message);
    }
}