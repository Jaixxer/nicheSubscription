import { CommandHandler , ICommandHandler} from "@nestjs/cqrs";
import { UpdateUserCommand } from "../../commands/admin/update-user.command";
import { UserRepository } from '../../repositories/user.repository';
import { Inject, Logger } from "@nestjs/common";
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    private readonly logger = new Logger(UpdateUserHandler.name);

    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: UpdateUserCommand): Promise<any> {
        const { id, email, firstName, lastName, phone, role, isActive } = command;

        // Update user profile
        const updatedUser = await this.userRepository.updateUserProfile(id, firstName, lastName, phone);
        
        // Update user email if provided
        if (email) {
            await this.userRepository.updateUserEmail(id, email);
        }

        // Update user role if provided
        if (role) {
            const roleIds = await this.userRepository.getRolesId(role);
            await this.userRepository.setUserRole(id, roleIds);
        }
        if (lastName || firstName || phone) {
            await this.userRepository.updateUserProfile(id, firstName, lastName, phone);
        }

        // Update user active status if provided
        if (isActive !== undefined || null) {
             await this.userRepository.changeUserStatus(id);
        }

        this.logger.log(`User with ID ${id} updated successfully`);
        return updatedUser;
    }
}