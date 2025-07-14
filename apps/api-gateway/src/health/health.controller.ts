import { Controller, Get,Post, Req, UseGuards } from '@nestjs/common';
import { HealthService } from './health.service';
import { RolesGuard } from 'libs/common/guards';
import { Roles } from 'libs/common/decorators';
import { UserRoles } from 'libs/common/enums';
import { AuthGuard } from '@nestjs/passport';

@Controller('health')
export class HealthController {
    constructor(private healthservice: HealthService){}
    @Get('test')
    health(){
        return this.healthservice.test();
    }
    
    @Get('guardtest')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRoles.User)
    guard(@Req() dto){
        return this.healthservice.guardtest(dto)
    }
    @Post('createstripecustomer')
    createStripeCustomer(@Req() req) {
        return this.healthservice.createStripeCustomer(req);
    }
}
