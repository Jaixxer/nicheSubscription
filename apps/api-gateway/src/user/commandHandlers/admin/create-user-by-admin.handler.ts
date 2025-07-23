import {CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserByAdmin } from '../../commands/admin/create-user-by-admin.command';
import { UserRepository } from '../../repositories/user.repository';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
@CommandHandler(CreateUserByAdmin)
export class CreateUserByAdminHandler implements ICommandHandler<CreateUserByAdmin> {
    private readonly logger = new Logger(CreateUserByAdminHandler.name);
    constructor(@Inject('BILLING_SERVICE') private readonly billingServ: ClientProxy,@Inject('NOTIFICATION_SERVICE')private readonly notificationServ:ClientProxy,private userRepository: UserRepository) {}
    
    async execute(command: CreateUserByAdmin): Promise<any> {
        const { email, password, role, phone, firstName, lastName } = command;
        // Validate the input data if necessary
        if (!email || !password || !role) {
            throw new Error('Email, password, and role are required');
        }
        
        // Call the repository method to create the user
        const create= await this.userRepository.createuser({
            email,
            password,
            role,
            phone,
            firstName,
            lastName
        });
        
        if(!!create){
            this.logger.log(`User created with email: ${email}, role: ${role}`);
            // Emit an event to the notification service
            this.notificationServ.emit('user_created', {
                email: create.email,
                role: create.role,
                id: create.id
            });
            this.logger.log("User creation event emitted to notification service");

            // If the user is a subscriber, send a message to the billing service
            if (role === 'Subscriber') {
                try {
                    const billingResponse = await lastValueFrom(this.billingServ.send('customer.created', {
                        customerId: create.id,
                        email: create.email,
                        name: `${firstName} ${lastName}`,
                        phone: phone || undefined
                    }))
                    
                    // Add Stripe ID to the user
                    await this.userRepository.addUserStripeId(create.id, billingResponse.stripeCustomerId);
                    this.logger.log(`Stripe customer created with ID: ${billingResponse.stripeCustomerId} for user: ${create.id}`);
                } catch (error) {
                    console.error('Failed to create customer in billing service:', error);
                }
            }
        }
    }

    }
