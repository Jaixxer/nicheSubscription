import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService{
  constructor(@Inject('BILLING_SERVICE') private client: ClientProxy){}
   async health(){
        await this.client.connect();
        console.log("Health_API")
        this.client.emit('Health',"null")
  }
}
