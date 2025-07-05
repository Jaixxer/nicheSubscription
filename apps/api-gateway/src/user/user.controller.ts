import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { SignUpDto } from '../../../../libs/common/dtos/dto.auth';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand, UpdateUserEmailCommand, UpdateUserPasswordCommand, UpdateUserProfileCommand } from './commands';
import { UpdateUserProfileDto } from 'libs/common/dtos/dto.user';
import { JwtStrategy } from '../auth/strategy';
import { findUserByEmailQuery } from './queries/find-user-by-email.query';
import { AuthGuard } from '@nestjs/passport';
import e from 'express';

@Controller('user')
export class UserController {
    constructor(private userRepository: UserRepository, private commandBus: CommandBus, private queryBus: QueryBus) { }
    createUser(dto: SignUpDto) {
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
}
