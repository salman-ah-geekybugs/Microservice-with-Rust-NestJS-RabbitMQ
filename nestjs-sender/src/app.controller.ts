import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // this.appService.sayHello();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  sendRustRequest() {
    return this.appService.sendProcessRequest();
  }
}
