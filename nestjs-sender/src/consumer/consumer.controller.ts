import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  private logger = new Logger(ConsumerController.name);
  constructor() {
    console.log('Consumer controller initialized');
  }
  @MessagePattern('completed', Transport.RMQ)
  public async testfunc(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      this.logger.log('Data from the queue', data);
      this.logger.log('context ', context.getPattern());
    } catch (error) {
      this.logger.error(error);
    }
  }
}
