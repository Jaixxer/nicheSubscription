import { Injectable } from '@nestjs/common';
@Injectable()
export class NotificationsMsService {
  userRegister(dto): {} {
    console.log(dto)
    return dto;
  }
}
