import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HashModule } from "@formulaic/hash";
import { IDModule } from "@formulaic/id";
import { UserService } from "./user.service";
import { User } from "./user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    HashModule,
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
