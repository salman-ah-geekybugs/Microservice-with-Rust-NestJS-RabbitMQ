import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumerModule } from './consumer/consumer.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'RECEIVER_SERVICE',
        useFactory: (configService: ConfigService) => {
          // const queueUrl = configService.getOrThrow<string>('RABBITMQ_URL');
          const url: RmqUrl = {
            hostname: configService.getOrThrow<string>('RABBITMQ_HOST'),
            port: configService.getOrThrow<number>('RABBITMQ_PORT'),
          };
          const queueName = configService.getOrThrow<string>('RECEIVER_QUEUE');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queueName,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
    ConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
