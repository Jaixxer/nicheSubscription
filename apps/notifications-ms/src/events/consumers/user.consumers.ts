import { EventPattern } from "@nestjs/microservices";
import { NotificationService } from "../../services/notification.service";
import { Controller } from '@nestjs/common';
@Controller()
export class UserConsumer{
    constructor(private readonly notificationService:NotificationService){}

    @EventPattern('phone.verification.sent')
    async sendPhoneVerificationSms(data:{phoneNumber:string,name:string,otp:number}){
        const sendVerification = await this.notificationService.sendPhoneVerificationSms(data.phoneNumber,data.name,data.otp)
    }
     @EventPattern('email.verification.sent')
    async handleVerificationEmail(data: { to: string, name: string, link: string }) {
        const { to, name, link } = data;
        const email =to
        if (!email || !name || !link) {
            throw new Error("Invalid data for email verification");
        }
        await this.notificationService.sendVerificationEmail(to, name, link);
    }
    @EventPattern('email.verification.success')
    async handleEmailVerificationSuccess(data: { email: string, firstName: string }) {
        const { email, firstName } = data;
        await this.notificationService.sendWelcomeEmail(email, firstName);
    }
}