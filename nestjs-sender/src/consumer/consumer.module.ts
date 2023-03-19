import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumerController } from './consumer.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'process_complete',
          queueOptions: {
            durable: true,
          },
          noAck: false,
          prefetchCount:1
        },
      },
    ]),
  ],
  // providers: [ConsumerService]
  controllers: [ConsumerController]
})
// @Module({
//   controllers: [ConsumerController]
// })
export class ConsumerModule {}
