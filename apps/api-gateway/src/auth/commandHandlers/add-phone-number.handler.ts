import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddPhoneNumberCommand } from "../commands/add-phone-number.command";
import { AuthRepository } from "../repositories/auth.repository";
import { verify } from "crypto";

@CommandHandler(AddPhoneNumberCommand)
export class AddPhoneNumberHandler implements ICommandHandler<AddPhoneNumberCommand> {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(command: AddPhoneNumberCommand): Promise<any> {
        const { userId, phoneNumber } = command;

        // Update the user's phone number in the repository
        const updatedUser = await this.authRepository.addPhoneNumber(userId, phoneNumber);

        if (!updatedUser) {
            throw new Error('Failed to add phone number');
        }

        return {
            success: true,
            message: "Phone number added successfully",
            verification:false
        };
    }
}
