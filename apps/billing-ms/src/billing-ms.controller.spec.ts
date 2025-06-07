import { Test, TestingModule } from '@nestjs/testing';
import { BillingMsController } from './billing-ms.controller';
import { BillingMsService } from './billing-ms.service';

describe('BillingMsController', () => {
  let billingMsController: BillingMsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BillingMsController],
      providers: [BillingMsService],
    }).compile();

    billingMsController = app.get<BillingMsController>(BillingMsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(billingMsController.getHello()).toBe('Hello World!');
    });
  });
});
