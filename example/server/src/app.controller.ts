import { Controller, Get } from '@nestjs/common';
import { AccessForbiddenException } from "@formulaic/data";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/throw-access-forbidden")
  public throwAccessForbidden() {
    throw new AccessForbiddenException();
  }
}
