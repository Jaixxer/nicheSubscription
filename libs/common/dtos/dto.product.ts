import { IsNotEmpty, IsOptional, IsString,IsNumber, MinLength, MaxLength, IsBoolean, IsEnum, IsArray, IsInt, Min, ValidateNested } from "class-validator"
import {PartialType} from "@nestjs/mapped-types"
import { Type } from "class-transformer";
export enum RenewalPlan{
    monthly= "monthly",
    weekly="weekly",
    biWeekly='biweekly'
}

export class PricingTierDto{
    @IsEnum(RenewalPlan)
    plan: RenewalPlan
    @IsInt()
    @Min(1)
    minQuantity: number;
    @IsInt()
    @IsOptional()
    @Min(1)
    maxQuanitiy: number;
    @IsNumber({maxDecimalPlaces:2})
    @Min(0.01)
    pricePerUnit: number;
    @IsOptional()
    @IsBoolean()
    isActive? : boolean
}

export class ProductDto{
    @MinLength(3,{message:"The name of the product should be atleast 3 characters long!"})
    @MaxLength(256,{message:"The name of the product should not exceed 156 character length!"})
    @IsString()
    @IsNotEmpty({message:"The name of the product should not be empty"})
    name : string;
    @IsString()
    @IsOptional()
    description : string;
    @IsOptional()
    @IsBoolean()
    allowBackorder:boolean;

    @IsInt()
    @Min(1)
    @IsOptional()
    maxSubscribers: number;

    @Min(0)
    @IsNotEmpty()
    @IsInt()
    stock: number;

    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>PricingTierDto)
    pricingTiers: PricingTierDto[];

    
    @IsArray()
    @IsEnum(RenewalPlan,{each:true})
    RenewalPlan: RenewalPlan[]

}
export class UpdateProductDto extends PartialType(ProductDto){}