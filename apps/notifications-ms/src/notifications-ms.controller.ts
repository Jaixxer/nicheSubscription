import { Controller, Get } from '@nestjs/common';
import { NotificationsMsService } from './notifications-ms.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsMsController {
  constructor(private readonly notificationsMsService: NotificationsMsService) {}
  

  @EventPattern('user_created')
  userRegister(@Payload() dto){
    console.log("Receivied the message")
    return this.notificationsMsService.userRegister(dto);
  }
}
