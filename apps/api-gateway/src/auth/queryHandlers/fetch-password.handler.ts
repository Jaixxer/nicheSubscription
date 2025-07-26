import { QueryHandler,IQueryHandler } from '@nestjs/cqrs';
import { FetchPasswordQuery } from '../queries/fetch-password.query';
import { AuthRepository } from '../repositories/auth.repository';

@QueryHandler(FetchPasswordQuery)
export class FetchPasswordQueryHandler implements IQueryHandler<FetchPasswordQuery> {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(query: FetchPasswordQuery): Promise<any> {
        const { email } = query;
        if(!email ) {
            throw new Error('Email must be provided');
        }
        const user = await this.authRepository.getCredentials(email);
        if (!user) {
            throw new Error('User not found');
        }
       
        return {success:true, user: { id: user.id, email: user.email,password:user.password }};
    }
}