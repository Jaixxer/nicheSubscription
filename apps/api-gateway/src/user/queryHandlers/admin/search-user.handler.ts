import { QueryHandler , IQueryHandler} from "@nestjs/cqrs";
import { SearchUserQuery } from "../../queries/admin/search-user.query";
import { UserRepository } from "../../repositories/user.repository";
import { UserRoles } from "libs/common/enums";
import { Inject, Logger } from "@nestjs/common";


@QueryHandler(SearchUserQuery)
export class SearchUserHandler implements IQueryHandler<SearchUserQuery> {
    constructor(private readonly userRepository: UserRepository,) {}
    private readonly logger = new Logger(SearchUserHandler.name);
    async execute(query: SearchUserQuery): Promise<any> {
        const { email, role, firstName, lastName, isActive,subscription,BillingStartDate,BillingEndDate, page , limit , sortBy , sortOrder  } = query;

        // Validate the input data if necessary
        if (!email && !role && !firstName && !lastName && isActive === undefined) {
            throw new Error('At least one search parameter must be provided');
        }
        const offset = (page - 1) * limit;
        this.logger.log(`Searching users with parameters: email=${email}, role=${role}, firstName=${firstName}, lastName=${lastName}, status=${status}, page=${page}, limit=${limit}, sortBy=${sortBy}, sortOrder=${sortOrder}`);

        // Fetch users based on the provided parameters
        const findUsers= await this.userRepository.searchUsers({
            email,
            role: role as UserRoles,
            firstName,
            lastName,
            isActive,
            subscription,
            BillingStartDate,
            BillingEndDate,
            offset,
            limit,
            sortBy,
            sortOrder
        });
        this.logger.log(`Found ${findUsers.length} users matching the search criteria`);
        return findUsers;
    }
    }
