import { Controller, Get } from '@nestjs/common';
import { BillingMsService } from './billing-ms.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class BillingMsController {
  constructor() {}
  @EventPattern("Health")
  follow(payload : any){
    console.log("Redis Connection Successful")
    return null
  }
}

