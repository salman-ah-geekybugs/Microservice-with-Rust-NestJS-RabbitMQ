import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConsumerModule } from './consumer/consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const consumerApp = await NestFactory.createMicroservice<MicroserviceOptions>(ConsumerModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'process_complete',
  //     queueOptions: {
  //       durable: false
  //     },
  //   },
  // });
  // await consumerApp.listen()
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options:{
      urls:['amqp://localhost:5672'],
      queue: 'process_complete',
      queueOptions: {
        durable: false
      }
    }
  });
  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
