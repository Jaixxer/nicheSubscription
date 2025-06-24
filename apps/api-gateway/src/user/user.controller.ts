import { Controller } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { SignUpDto } from '../../../../libs/common/dtos/dto.auth';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands';

@Controller('user')
export class UserController {
    constructor(private userRepository:UserRepository, private commandBus: CommandBus){}
    createUser(dto:SignUpDto){
        return this.commandBus.execute(new CreateUserCommand(
            dto.email,dto.password,dto.role,dto.phone,dto.firstName,dto.lastName
        ))
    }
    findUser(email:string){
        return this.userRepository.findUser(email)
    }
}
