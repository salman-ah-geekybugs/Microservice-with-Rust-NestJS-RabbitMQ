import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumerController } from './consumer/consumer.controller';
import { ConsumerModule } from './consumer/consumer.module';
// import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RECEIVER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'receiver_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
