import { CommandHandler } from "@nestjs/cqrs";
import { ICommandHandler } from "@nestjs/cqrs";
import { SendPhoneVerificationCommand } from "../commands/send-phone-verification.command";
import { RedisService } from "../../redis/redis.service";
import { TokenService } from "../services/token.service";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";


@CommandHandler(SendPhoneVerificationCommand)
export class SendPhoneVerificationHandler implements ICommandHandler<SendPhoneVerificationCommand>{
    constructor(private readonly redisService: RedisService, private readonly tokenService:TokenService,@Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy){}

    async execute(command: SendPhoneVerificationCommand): Promise<any> {
        const {userId,name,phoneNumber}=command
        if (!userId || !phoneNumber){
            throw new Error("Invalid Request!")
        }
        const min = Math.ceil(1000)
        const max = Math.floor(9999)
        const otp = Math.floor(Math.random() * (max-min+1)) 
        await this.redisService.set(`phoneNumber-${phoneNumber}-otp`,`${otp}`,600)
        await this.redisService.set(`phoneNumber-${phoneNumber}-otp-count`,'1')
        this.notificationService.emit('phone.verification.sent',{"to":phoneNumber,"name":name,"otp":otp})

    }
}