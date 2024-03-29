import { AuthModule } from "@formulaic/auth-module";
import { IDModule } from '@formulaic/id';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { abilityFor, AclUser } from "acl";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IDs } from './id';
import { JWTPayload } from "./user/dto/jwt-payload";
import { User } from "./user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "test.sql",
      entities: [
        User,
      ],
      synchronize: true,
    }),
    AuthModule.forRootAsync({
      global: true,
      imports: [],
      inject: [],
      useFactory: () => ({
        secretOrPublicKey: "test",
        defaultPolicy: "allow",
        payload: JWTPayload,
        userId: ({ sub }) => sub,
        getUserById: id => null,
        getRoles: ({ roles }) => roles,
        getAcl: (payload) => {
          if(payload) {
            const { sub, roles } = payload;
            const user: AclUser = {
              kind: "AclUser",
              id: sub,
              roles,
            };
            return abilityFor(user);
          }
          return abilityFor();
        },
      }),
    }),
    IDModule.forRoot({
      ids: IDs,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
