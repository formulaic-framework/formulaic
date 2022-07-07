import { Module } from "@nestjs/common";
import { IDModule } from "@formulaic/id";
import { UserService } from "./user.service";

@Module({
  imports: [
    IDModule,
  ],
  providers: [
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
