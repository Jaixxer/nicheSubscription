import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands";
import { UserRepository } from '../repositories/user.repository';
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { Roles } from "libs/common/dtos";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand>{
    private readonly logger = new Logger(CreateUserHandler.name);

    constructor(
        private readonly userRepository:UserRepository,
        @Inject("NOTIFICATION_SERVICE") private redis: ClientProxy,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ){}

    async execute(command: CreateUserCommand): Promise<any> {
        const roles = [command.role,"User"]
        const user = await this.userRepository.createuser({email:command.email,password:command.password,firstName:command.firstName,lastName:command.lastName,phone:command.phone,role:roles})
        if(user){
            this.redis.emit('user_created',{
                email:user.email,role:user.role,id:user.id
            })

            // Send customer.created message to billing service for subscribers only
            if (command.role === Roles.Subscriber) {
                try {
                    const customerCreatedData = {
                        customerId: user.id,
                        email: user.email,
                        name: `${command.firstName} ${command.lastName}`,
                        phone: command.phone || undefined
                    };

                    const billingResponse = await lastValueFrom(
                        this.billingClient.send('customer.created', customerCreatedData)
                    );
                    await this.userRepository.addUserStripeId(user.id, billingResponse.stripeCustomerId);
                    console.log('Billing service response for customer.created:', billingResponse);
                    this.logger.log(`Customer created in billing service for userId: ${user.id}`);
                } catch (error) {
                    console.error('Failed to create customer in billing service:', error);
                    // Continue with user creation even if billing service fails
                }
            }

            return user
        }
    }
}