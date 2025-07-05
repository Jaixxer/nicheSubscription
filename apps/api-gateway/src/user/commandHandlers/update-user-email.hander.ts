import { CommandHandler,ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserEmailCommand } from "../commands/update-user-email.command";
import * as argon2 from "argon2";
import { UserRepository } from "../repositories/user.repository";
@CommandHandler(UpdateUserEmailCommand)

export class UpdaterUserEmailHandler implements ICommandHandler<UpdateUserEmailCommand> {
    constructor(
        private readonly userRepo: UserRepository
    ) { }
    async execute(command: UpdateUserEmailCommand): Promise<any> {
        const { id,password,newEmail } = command;

        const user = await this.userRepo.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
      
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            console.log(isPasswordValid)    
            throw new Error('Invalid password');
        }
        user.email = newEmail;
        const result =await this.userRepo.updateUserEmail(id,newEmail);

        return result
    }
}

