import { AuthModule } from "@formulaic/auth-module";
import { IDModule } from '@formulaic/id';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IDs } from './id';
import { JWTPayload } from "./user/dto/jwt-payload";

@Module({
  imports: [
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
