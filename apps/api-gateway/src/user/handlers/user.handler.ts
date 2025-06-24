import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands";
import { UserRepository } from './../repositories/user.repository';
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand>{
    constructor(
        private readonly userRepository:UserRepository,
        @Inject("NOTIFICATION_SERVICE") private redis: ClientProxy
    ){}
    async execute(command: CreateUserCommand): Promise<any> {
        const user = await this.userRepository.createuser({email:command.email,password:command.password,firstName:command.firstName,lastName:command.lastName,phone:command.phone,role:command.role})
        if(user){
              this.redis.emit('user_created',{
           email:"email",role:"role" 
        })
        return user
        
    }
       
        
    }
    
}