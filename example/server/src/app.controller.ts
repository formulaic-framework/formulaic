import { Controller, Get } from '@nestjs/common';
import { AccessForbiddenException } from "@formulaic/data";
import { AccessForbidden, EntityNotFound } from "@formulaic/fp";
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

  @Get("/access-forbidden")
  public returnAccessForbidden() {
    return new AccessForbidden("User");
  }

  @Get("/entity-not-found")
  public returnEntityNotFound() {
    return new EntityNotFound("User");
  }
}
