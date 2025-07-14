import { Controller, Post } from "@nestjs/common";
import { ApiService } from "./api.service";
@Controller('api')
export class ApiController {
    constructor(private readonly apiService: ApiService) {}
    @Post('billing')
    async handleBillingEvent(req: any) {
        // Extract the event from the request body
        const event = req.body;
        // Call the service to handle the event
        return this.apiService.handleBillingEvent(event);
    }
  
}