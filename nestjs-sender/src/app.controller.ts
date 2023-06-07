import { Controller, Get, HttpCode, Post } from '@nestjs/common';
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
  @HttpCode(200)
  sendRustRequest() {
    console.log('Processing request');
    return this.appService.sendProcessRequest();
  }
}
