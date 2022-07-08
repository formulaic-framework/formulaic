import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IDModule } from "@formulaic/id";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
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
