import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { ConsumerController } from './consumer.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CONSUMER_SERVICE',
        useFactory: (configService: ConfigService) => {
          const queueName = configService.getOrThrow<string>('CONSUMER_QUEUE');
          const url: RmqUrl = {
            hostname: configService.getOrThrow<string>('RABBITMQ_HOST'),
            port: configService.getOrThrow<number>('RABBITMQ_PORT'),
          };
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queueName,
              queueOptions: {
                durable: true,
              },
              noAck: false,
              prefetchCount: 1,
            },
          };
        },
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],

  controllers: [ConsumerController],
})
export class ConsumerModule implements OnModuleInit {
  onModuleInit() {
    console.log(`Process microservice ${process.pid}`);
  }
}
