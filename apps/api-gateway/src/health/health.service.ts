import { Injectable ,Inject} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class HealthService {
    constructor(@Inject('BILLING_SERVICE') private billingServ:ClientProxy){}
    test(){}
}
