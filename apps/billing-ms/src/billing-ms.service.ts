import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingMsService {
  getHello(): string {
    return 'Hello World!';
  }
}
