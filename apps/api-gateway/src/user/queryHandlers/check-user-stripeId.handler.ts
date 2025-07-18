import { IQueryHandler , QueryHandler} from '@nestjs/cqrs';
import { CheckUserStripIdQuery } from '../queries/check-user-stripId.query';
import { UserRepository } from '../repositories/user.repository';

@QueryHandler(CheckUserStripIdQuery)
export class CheckUserStripeIdHandler implements IQueryHandler<CheckUserStripIdQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: CheckUserStripIdQuery): Promise<String | null> {
    const { userId } = query;
    const user = await this.userRepository.checkUserStripeId(userId);
    
    return user; // Returns true if stripeId exists, false otherwise
  }
}