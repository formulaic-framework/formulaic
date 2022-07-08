import { APP_GUARD } from "@nestjs/core";
import { DynamicModule, Module } from "@nestjs/common";
import { AUTH_MODULE_OPTIONS } from "./auth.constants";
import { AuthGuard } from "./auth.guard";
import { AuthModuleAsyncOptions } from "./AuthModuleOptions";

@Module({
})
export class AuthModule {

  public static forRootAsync<
    JWTPayload extends object,
    User,
    UserId extends string | number = string | number,
  >(options: AuthModuleAsyncOptions<JWTPayload, User, UserId>): DynamicModule {
    const authGuard = {
      provide: options.global === true ? APP_GUARD : AuthGuard,
      useClass: AuthGuard,
    };

    const authGuardExport = options.global
      ? []
      : [authGuard];

    return {
      module: AuthModule,
      imports: [
        ...options.imports,
      ],
      providers: [
        {
          provide: AUTH_MODULE_OPTIONS,
          inject: options.inject || [],
          useFactory: options.useFactory,
        },
        authGuard,
      ],
      exports: [
        ...authGuardExport,
      ],
    };
  }

}
