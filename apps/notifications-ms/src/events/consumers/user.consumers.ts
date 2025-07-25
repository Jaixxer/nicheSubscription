import { EventPattern } from "@nestjs/microservices";
import { NotificationService } from "../../services/notification.service";


export class UserConsumer{
    constructor(private readonly notificationService:NotificationService){}

    @EventPattern('phone.verification.sent')
    async sendPhoneVerificationSms(data:{phoneNumber:string,name:string,otp:number}){
        const sendVerification = await this.notificationService.sendPhoneVerificationSms(data.phoneNumber,data.name,data.otp)
    }
     @EventPattern('email.verification.sent')
    async handleVerificationEmail(data: { email: string, name: string, link: string }) {
        const { email, name, link } = data;
        await this.notificationService.sendVerificationEmail(email, name, link);
    }
}