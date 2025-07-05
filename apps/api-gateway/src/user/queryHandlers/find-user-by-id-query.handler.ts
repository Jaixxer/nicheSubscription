import { QueryHandler ,IQueryHandler} from "@nestjs/cqrs";
import { findUserByIdQuery } from "../queries/index";
import { UserRepository } from "../repositories/user.repository";
@QueryHandler(findUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<findUserByIdQuery> {
    constructor(
        private readonly userRepo: UserRepository
    ) { }
    async execute(query: findUserByIdQuery): Promise<any> {
        const user = await this.userRepo.findUserById(query.id)
        if(!user){
            throw new Error('User not found');
        }
        return { id:user.id,email:user.email,firstName:user.firstName,lastName:user.lastName }; 
    }
}