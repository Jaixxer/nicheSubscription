import { QueryHandler,IQueryHandler } from '@nestjs/cqrs';
import { GetSubscriptionByUserQuery } from '../queries/index'
import { SubscriptionQueryRepository } from '../repositories/subscription.query.repository';

@QueryHandler(GetSubscriptionByUserQuery)

export class GetSubscriptionByUserQueryHandler implements IQueryHandler<GetSubscriptionByUserQuery> {
    constructor(private readonly subscriptionQueryRepo: SubscriptionQueryRepository) {}

    async execute(query: GetSubscriptionByUserQuery): Promise<any> {
        const { subscriberId } = query;
        const subscriptions = await this.subscriptionQueryRepo.getSubscriptionByUser(subscriberId);
        if (!subscriptions) {
            throw new Error('No subscriptions found for this user.');
        }
        return subscriptions;
    }
}

