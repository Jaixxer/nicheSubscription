import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands";
import { UserRepository } from '../repositories/user.repository';
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Logger } from "@nestjs/common";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand>{
    private readonly logger = new Logger(CreateUserHandler.name);

    constructor(
        private readonly userRepository:UserRepository,
        @Inject("NOTIFICATION_SERVICE") private redis: ClientProxy,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ){}

    async execute(command: CreateUserCommand): Promise<any> {
        const user = await this.userRepository.createuser({email:command.email,password:command.password,firstName:command.firstName,lastName:command.lastName,phone:command.phone,role:command.role})
        if(user){
            this.redis.emit('user_created',{
                email:user.email,role:user.role,id:user.id
            })

            // // Emit event to billing service
            // try {
            //     this.billingClient.emit('user.created', {
            //         userId: user.id,
            //         email: user.email,
            //         firstName: command.firstName,
            //         lastName: command.lastName,
            //         role: user.role,
            //         createdAt: new Date()
            //     });
            // } catch (error) {
            //     this.logger.error('Failed to emit user.created event:', error);
            // }

            return user
        }
    }
}