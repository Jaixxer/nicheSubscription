import { Injectable ,Inject} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
    constructor(@Inject('BILLING_SERVICE') private billingServ:ClientProxy){}
    test(){
        this.billingServ.emit("Health","tests")
        console.log("Client Module Working")
    }    
    guardtest(dto){
        const user = dto.user
        return user
    }
   async createStripeCustomer(req){
        const data = req.body
        return await (this.billingServ.send("create-customer",data))
    }
}
