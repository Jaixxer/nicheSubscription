import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from '../auth/dtos';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    createUser(dto:SignUpDto){
        return this.userService.createuser(dto)
    }
    findUser(email:string){
        return this.userService.findUser(email)
    }
}
