import { Controller, Get } from '@nestjs/common';
import { AccessForbidden, EntityNotFound } from "@formulaic/fp";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
