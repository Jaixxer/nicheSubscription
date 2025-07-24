import { QueryHandler,IQueryHandler } from '@nestjs/cqrs';
import { ValidateCredentialsQuery } from '../queries/validate-credentials.query';
import { AuthRepository } from '../repositories/auth.repository';

@QueryHandler(ValidateCredentialsQuery)
export class ValidateCredentialsHandler implements IQueryHandler<ValidateCredentialsQuery> {
    constructor(private readonly authRepository: AuthRepository) {}

    async execute(query: ValidateCredentialsQuery): Promise<any> {
        const { email, password } = query;
        if(!email || !password) {
            throw new Error('Email and password must be provided');
        }
        const user = await this.authRepository.getCredentials(email);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.password !== password) {
            throw new Error('Invalid credentials');
        }
        return {}
    }
}