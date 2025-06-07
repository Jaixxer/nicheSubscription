import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsMsController } from './notifications-ms.controller';
import { NotificationsMsService } from './notifications-ms.service';

describe('NotificationsMsController', () => {
  let notificationsMsController: NotificationsMsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsMsController],
      providers: [NotificationsMsService],
    }).compile();

    notificationsMsController = app.get<NotificationsMsController>(NotificationsMsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationsMsController.getHello()).toBe('Hello World!');
    });
  });
});
