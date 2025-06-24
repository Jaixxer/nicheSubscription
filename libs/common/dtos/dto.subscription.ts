import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { RenewalPlan } from "./dto.product";
import {PartialType} from "@nestjs/mapped-types"

enum Status{
    active="active",
    cancelled="cancelled",
    paused='paused'
}

export class SubscriptionDto{
    @IsNotEmpty()
    @IsString()
    productId : string;
    @IsBoolean()
    @IsOptional()
    autoRenew: boolean;
    @IsNotEmpty()
    @IsEnum(Status,{message:"Invalid status!"})
    status: Status;
    @IsEnum(RenewalPlan)
    chosenPlan: RenewalPlan;
    @IsInt()
    @Min(1)
    quantity: number;
}

export class UpdateSubscriptionDto extends PartialType(SubscriptionDto){}