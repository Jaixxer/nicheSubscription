import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    constructor(private healthservice: HealthService){}
    @Get('test')
    health(){
        return this.healthservice.test();
    }
}
