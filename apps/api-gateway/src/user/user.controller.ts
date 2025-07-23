import { Body, Controller, Post,Get, Req, UseGuards } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { SignUpDto } from '../../../../libs/common/dtos/dto.auth';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateConnectedAccountCommand, CreateSetupIntentCommand, CreateUserCommand, UpdateUserEmailCommand, UpdateUserPasswordCommand, UpdateUserProfileCommand } from './commands';
import { UpdateUserProfileDto } from 'libs/common/dtos/dto.user';
import { findUserByEmailQuery } from './queries/find-user-by-email.query';
import { AuthGuard } from '@nestjs/passport';
import { findUserByIdQuery } from './queries';
import { Roles } from 'libs/common/decorators';
import { RolesGuard } from 'libs/common/guards';
import { UserRoles } from 'libs/common/enums';
import { ConfirmSetupIntentCommand } from './commands/confrim-setup-intent.command';

@Controller('user')
export class UserController {
    constructor(private userRepository: UserRepository, private commandBus: CommandBus, private queryBus: QueryBus) { }
    @Post('create')
    createUser(@Body() dto: SignUpDto) {
        return this.commandBus.execute(new CreateUserCommand(
            dto.email, dto.password, dto.role, dto.phone, dto.firstName, dto.lastName
        )) 
    }
    findUser(email: string) {
        return this.queryBus.execute(new findUserByEmailQuery(email));
    }
    findUserById(id: string) {
        return this.queryBus.execute(new findUserByEmailQuery(id));
    }
    @Post('update-profile')
    @UseGuards(AuthGuard('jwt'))
    updateUserProfile(@Body() dto: UpdateUserProfileDto, @Req() user) {
        // console.log("user", user);
        const id = user.user.id
        console.log("id", id);
        console.log(dto)
        return this.commandBus.execute(new UpdateUserProfileCommand(
            id,
            dto.firstName,
            dto.lastName,
            dto.phone
        ));
    }
    @Post('update-user-email')
    @UseGuards(AuthGuard('jwt'))
    updateUserEmail(@Body() dto: { email: string, password: string }, @Req() user) {
        const id = user.user.id;
        
        return this.commandBus.execute(new UpdateUserEmailCommand(
            id,dto.email,
            dto.password,))
    }
    @Post('update-user-password')
    @UseGuards(AuthGuard('jwt'))
    updateUserPassword(@Body() dto: { oldPassword: string, newPassword: string }, @Req() user) {
        const id = user.user.id;
        return this.commandBus.execute(new UpdateUserPasswordCommand(
            id,
            dto.oldPassword,
            dto.newPassword, ))
    }
    @Get('create-connected-account')
    @UseGuards(AuthGuard('jwt'))
    async createConnectedAccount( @Req() req) {
        const curatorId = req.user.id;
        const userData = await this.queryBus.execute(new findUserByIdQuery(curatorId))

        try {
            const command = await this.commandBus.execute(new CreateConnectedAccountCommand(
                curatorId,
                userData.email
            ));
            return { message: "Connected account created successfully", data: command };
        } catch (error) {
            console.error('Error creating connected account:', error);
            return { message: "Failed to create connected account", error: error.message };
        }
    }

    @Post('create-setup-intent')
    @UseGuards(AuthGuard('jwt'))
    @Roles(UserRoles.Subscriber)
    async createSetupIntent(@Req() req) {
        const userId = req.user.id;
        
        // Check if user is a subscriber
        
        try {
            const result = await this.commandBus.execute(new CreateSetupIntentCommand(userId));
            return { message: "Setup intent created successfully", data: result };
        } catch (error) {
            console.error('Error creating setup intent:', error);
            return { message: "Failed to create setup intent", error: error.message };
        }
    }
   

}
