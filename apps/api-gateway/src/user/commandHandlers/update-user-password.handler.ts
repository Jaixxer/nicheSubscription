import { CommandHandler ,ICommandHandler} from "@nestjs/cqrs";
import { UpdateUserPasswordCommand } from "../commands/index";
import * as argon2 from "argon2";
import { UserRepository } from "../repositories/user.repository";
@CommandHandler(UpdateUserPasswordCommand)

export class UpdateUserPasswordHandler implements ICommandHandler<UpdateUserPasswordCommand> {
    constructor(
        private readonly userRepo: UserRepository
    ) { }
    async execute(command: UpdateUserPasswordCommand): Promise<any> {
        const { id, oldPassword, newPassword } = command;
        console.log(id, oldPassword, newPassword);
        const user = await this.userRepo.findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await argon2.verify(user.password, oldPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        user.password = await argon2.hash(newPassword);
        const result = await this.userRepo.updateUserPassword(id, user.password);

        return result;
    }
}