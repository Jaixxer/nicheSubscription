import { Controller, Get } from '@nestjs/common';
import { BillingMsService } from './billing-ms.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class BillingMsController {
  constructor(private billingMsService: BillingMsService) {}
  @EventPattern("Health")
  follow(payload : any){
    console.log("Redis Connection Successful")
    return null

  }
  @MessagePattern('create-customer')
  createCustomer(data: any) {
    return this.billingMsService.createCustomer(data);
}
  @MessagePattern('billing-event')
  handleBillingEvent(event: any) {
    return "this.billingMsService.handleBillingEvent(event);"
  }
}