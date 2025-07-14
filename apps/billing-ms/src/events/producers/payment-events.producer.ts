import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentSuccessEvent, PaymentFailureEvent, PaymentRetryRequiredEvent } from '../dto/outgoing-events.dto';

@Injectable()
export class PaymentEventsProducer {
  private readonly logger = new Logger(PaymentEventsProducer.name);

  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  async emitPaymentSuccess(event: PaymentSuccessEvent): Promise<void> {
    try {
      this.logger.log(`Emitting PaymentSuccess event for paymentRecordId: ${event.paymentRecordId}`);
      
      this.eventClient.emit('payment.success', event);

      this.logger.log(`PaymentSuccess event emitted successfully for paymentRecordId: ${event.paymentRecordId}`);
    } catch (error) {
      this.logger.error(`Failed to emit PaymentSuccess event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitPaymentFailure(event: PaymentFailureEvent): Promise<void> {
    try {
      this.logger.log(`Emitting PaymentFailure event for paymentRecordId: ${event.paymentRecordId}`);
      
      this.eventClient.emit('payment.failure', event);

      this.logger.log(`PaymentFailure event emitted successfully for paymentRecordId: ${event.paymentRecordId}`);
    } catch (error) {
      this.logger.error(`Failed to emit PaymentFailure event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitPaymentRetryRequired(event: PaymentRetryRequiredEvent): Promise<void> {
    try {
      this.logger.log(`Emitting PaymentRetryRequired event for paymentRecordId: ${event.paymentRecordId}`);
      
      this.eventClient.emit('payment.retry.required', event);

      this.logger.log(`PaymentRetryRequired event emitted successfully for paymentRecordId: ${event.paymentRecordId}`);
    } catch (error) {
      this.logger.error(`Failed to emit PaymentRetryRequired event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
