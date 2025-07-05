import { CommandHandler } from "@nestjs/cqrs";
import { UpdateUserProfileCommand } from "../commands/index";
import { UserRepository } from '../repositories/user.repository';
@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserHandler {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(command: UpdateUserProfileCommand): Promise<any> {
        const {id,firstName,lastName,phone}= command;
        console.log(id)
        const user = await this.userRepository.updateUserProfile(id,firstName,lastName,phone  );
        return user;
    }
}