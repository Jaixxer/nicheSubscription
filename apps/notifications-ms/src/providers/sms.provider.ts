
import { ConfigService } from "@nestjs/config";
import { Injectable, Logger } from "@nestjs/common";
import * as twilio from "twilio";
@Injectable()
export class SmsProvider {
    private readonly logger = new Logger(SmsProvider.name);
    private client: twilio.Twilio;

    constructor(private readonly configService: ConfigService) {
        const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SSID');
        const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
        this.client = twilio(accountSid, authToken);
    }

    async sendSms(to: string, body: string): Promise<void> {
        const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
        try {
            this.logger.log(`Sending SMS to ${to}`);
            await this.client.messages.create({
                body,
                from,
                to
            });
            this.logger.log(`SMS sent successfully to ${to}`);
        } catch (error) {
            console.error(`Failed to send SMS to ${to}:`, error);
            this.logger.error(`Failed to send SMS to ${to}`, error);
        }
    }
}
