import { QueryHandler,IQueryHandler } from '@nestjs/cqrs';
import { GetSubscriptionsQuery } from '../../queries/admin/get-subscriptions.query';
import { SubscriptionQueryRepository } from '../../repositories/subscription.query.repository';
import { Logger } from '@nestjs/common';

@QueryHandler(GetSubscriptionsQuery)
export class GetSubscriptionsQueryHandler implements IQueryHandler<GetSubscriptionsQuery> {
    private readonly logger = new Logger(GetSubscriptionsQueryHandler.name);

    constructor(private readonly subscriptionQueryRepository: SubscriptionQueryRepository) {}

    async execute(query: GetSubscriptionsQuery): Promise<any> {
        this.logger.log(`Subscriptions being fetched by userId: ${query.userId}`);
        try {
            const offset = (query.page - 1) * query.limit;
            const subscriptions = await this.subscriptionQueryRepository.getSubscriptions( query.status, query.limit, offset);
            this.logger.log(`Fetched ${subscriptions.length} subscriptions for userId: ${query.userId}`);
            return subscriptions;
        } catch (error) {
            this.logger.error(`Failed to fetch subscriptions for userId: ${query.userId}`, error);
            throw error;
        }
    }
}

