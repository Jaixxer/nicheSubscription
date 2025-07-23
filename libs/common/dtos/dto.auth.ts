import { IsEmail,IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

export enum Roles{
    Curator="Curator",
    Subscriber="Subscriber"
}

export enum UserRoles{
    Admin="Admin",
    Curator="Curator",
    Subscriber="Subscriber"
}

export class LoginDto{
    @IsEmail()
    @IsNotEmpty({message:"Email should not be empty!"})
    email: string ;
    @IsNotEmpty({message:"Password should not be empty"})
    @IsString()
    @IsStrongPassword()
    password:string;
}

export class SignUpDto extends LoginDto{
    @IsString()
    @IsOptional()
    firstName?: string;
    
    @IsString()
    @IsOptional()
    lastName?: string;
    @IsNotEmpty()
    @IsEnum([...Object.values(UserRoles), ...Object.values(Roles)], { message: "Not a valid role!" })
    role:any;
    @IsOptional()
    @IsPhoneNumber()
    phone?:string
}
