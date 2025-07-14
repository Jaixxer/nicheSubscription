import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ApiService {
    constructor(@Inject('BILLING_SERVICE')private billingService: ClientProxy) {}
    async handleBillingEvent(event: any) {
        // Process the billing event
        const sendMessage = await this.billingService.send('billing_event', event);
        // You can add your business logic here
        return sendMessage;

    }
}
