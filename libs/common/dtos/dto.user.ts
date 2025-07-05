import { IsNotEmpty, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserProfileDto {
    id:string;
    @IsOptional()
    @IsString()
    phone?: string;
    @IsOptional()
    @IsString()
    firstName?: string;
    @IsOptional()
    @IsString()
    lastName?: string;

}