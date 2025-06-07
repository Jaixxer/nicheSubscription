import { Controller, Get } from '@nestjs/common';
import { BillingMsService } from './billing-ms.service';

@Controller()
export class BillingMsController {
  constructor(private readonly billingMsService: BillingMsService) {}

  @Get()
  getHello(): string {
    return this.billingMsService.getHello();
  }
}
