import { IsEmail,IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";

enum Roles{
    Curator="Curator",
    Subscriber="Subscriber"
}


export class LoginDto{
    @IsEmail()
    @IsNotEmpty({message:"Email should not be empty!"})
    email: string ;
    @IsNotEmpty({message:"Password should not be empty"})
    @IsString()
    // @IsStrongPassword()
    password:string;
}

export class SignUpDto extends LoginDto{
    @IsString()
    @IsOptional()
    firstName: string;
    
    @IsString()
    @IsOptional()
    lastName: string;
    @IsNotEmpty()
    @IsEnum(Roles,{message:"Not a valid role!"})
    role: Roles;
    @IsOptional()
    @IsPhoneNumber()
    phone:string
}
