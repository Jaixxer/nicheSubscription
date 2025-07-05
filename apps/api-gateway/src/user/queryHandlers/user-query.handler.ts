import { QueryHandler } from "@nestjs/cqrs";
import { findUserByEmailQuery } from "../queries/find-user-by-email.query";
import { UserRepository } from '../repositories/user.repository';
import { IQueryHandler } from "@nestjs/cqrs";

@QueryHandler(findUserByEmailQuery)

export class FindUserByEmailHandler implements IQueryHandler<findUserByEmailQuery> {
    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async execute(query: findUserByEmailQuery): Promise<any> {
        const user = await this.userRepository.findUser(query.email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
