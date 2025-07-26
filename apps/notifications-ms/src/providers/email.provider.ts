import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class EmailProvider{
    private readonly logger = new Logger(EmailProvider.name);
    private transporter: nodemailer.Transporter;
    constructor(private readonly configService: ConfigService) {
        this.transporter=nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS')
            }
        })}

    async sendEmail(to:string,subject:string,html:string):Promise<void>{
        try {
            this.logger.log(`Sending email to ${to} with subject "${subject}"`);
            await this.transporter.sendMail({
                to:to,
                subject:subject,
                html:html
            })
            this.logger.log(`Email sent successfully to ${to}`);
            return Promise.resolve();
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
            this.logger.error(`Failed to send email to ${to}`, error);
        }
    }
    async sendEmailWithAttachment(
        to: string,
        subject: string,
        html: string,
        attachments: nodemailer.SendMailOptions['attachments']
    ): Promise<void> {
        try {
            this.logger.log(`Sending email with attachment to ${to} with subject "${subject}"`);
            await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: html,
                attachments: attachments
            });
            this.logger.log(`Email with attachment sent successfully to ${to}`);
        } catch (error) {
            console.error(`Failed to send email with attachment to ${to}:`, error);
            this.logger.error(`Failed to send email with attachment to ${to}`, error);
        }
    }
    
}