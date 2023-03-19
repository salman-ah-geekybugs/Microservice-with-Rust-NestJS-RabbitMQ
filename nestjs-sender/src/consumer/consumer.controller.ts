import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, Transport } from '@nestjs/microservices';

@Controller()
export class ConsumerController {

  constructor(){
    console.log("Consumer controller initialized")
  }
  @MessagePattern('completed', Transport.RMQ)
  public  async testfunc(@Payload() data: any, @Ctx() context: RmqContext){
    console.log("Data from the queue",data);
    console.log("context ", context.getPattern());
    // channel.ack(orginalMessage);
  }

  


}
