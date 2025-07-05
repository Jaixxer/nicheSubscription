import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray, IsEnum, IsInt, Min, MaxLength, MinLength, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { BoxItemDto } from "./dto.box-item";
import { RenewalPlan, PricingTierDto } from "./dto.product";

export class WizardStep1Dto {
    @MinLength(3, { message: "The name of the product should be at least 3 characters long!" })
    @MaxLength(256, { message: "The name of the product should not exceed 256 characters!" })
    @IsString()
    @IsNotEmpty({ message: "The name of the product should not be empty" })
    name: string;

    @IsString()
    @IsOptional()
    description?: string | null;

    @IsString()
    @IsNotEmpty({ message: "Category is required" })
    category: string;
}

export class WizardStep2Dto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PricingTierDto)
    pricingTiers: PricingTierDto[];

    @IsArray()
    @IsEnum(RenewalPlan, { each: true })
    availablePlans: RenewalPlan[];

    @IsOptional()
    @IsBoolean()
    allowBackorder?: boolean;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxSubscribers?: number;
}

export class WizardStep3Dto {
    @IsInt()
    @Min(0)
    stock: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BoxItemDto)
    boxItems: BoxItemDto[];
}

export class WizardStep4Dto {
    @IsBoolean()
    publish: boolean;
}


