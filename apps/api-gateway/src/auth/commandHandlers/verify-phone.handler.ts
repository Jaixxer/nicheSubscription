import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RedisService } from "../../redis/redis.service";
import { VerifyPhoneCommand } from "../commands/verify-phone.command";
import { ForbiddenException } from "@nestjs/common";
import { AuthRepository } from "../repositories/auth.repository";
@CommandHandler(VerifyPhoneCommand)
export class VerifyPhoneHandler implements ICommandHandler<VerifyPhoneCommand>{
    constructor(private readonly redisService:RedisService,private readonly authRepo:AuthRepository){}

    async execute(command: VerifyPhoneCommand): Promise<any> {
        const {userId,phoneNumber,enteredOtp} = command
        if(!userId || !phoneNumber || !enteredOtp){
            throw new ForbiddenException("Invalid Request!")
        }
        const redisData  = await this.redisService.get(`phoneNumber-${phoneNumber}-otp`)
        if (redisData == null){
            throw new Error("OTP has expired!")
        }
        let counter = await this.redisService.get(`phoneNumber-${phoneNumber}-otp-count`);
        let count = counter ? parseInt(counter, 10) : 0;

        if(redisData != enteredOtp){
            count += 1;
            await this.redisService.set(`phoneNumber-${phoneNumber}-otp-count`, count.toString());
            if (count >= 5) {
                await this.redisService.del(`phoneNumber-${phoneNumber}-otp`);
                await this.redisService.del(`phoneNumber-${phoneNumber}-otp-count`);
                throw new Error("Maximum attempts exceeded. Please try again later.");
            }
            throw new Error("Invalid OTP")
        }
        await this.redisService.del(`phoneNumber-${phoneNumber}-otp`);
        await this.redisService.del(`phoneNumber-${phoneNumber}-otp-count`);
        await this.authRepo.verifyPhoneNumber(userId);
        return {
            success: true,
            message: "Phone number verified successfully"
        };


    }
}
