import { Secret, VerifyOptions } from "jsonwebtoken";
import { ModuleMetadata } from "@nestjs/common";
import type { ClassType } from "class-transformer-validator";

export type MaybePromise<T> = T | Promise<T>;

/**
 * Configuration for authentication parsing and validation.
 */
export interface AuthModuleOptions<
  JWTPayload extends object,
  User,
  UserId extends string | number = string | number,
  AbilityType = any,
> {

  /**
   * Authentication to use when decoding JWTs.
   */
  secretOrPublicKey: Secret;

  /**
   * Options to provide to `jwt.verify` - see documentation
   * for `jsonwebtoken`.
   */
  jwtOptions?: VerifyOptions;

  /**
   * Configure the default behavior of the request guard for routes
   * that do not set any authentication parameters.
   *
   * Defaults to `"allow"`, allowing unauthenticated users access.
   */
  defaultPolicy?: "allow" | "deny";

  /**
   * The structure of JWT payloads to parse.
   * Should be a class annotated with `class-validator` annotations.
   */
  payload: ClassType<JWTPayload>;

  /**
   * A method to extract the user ID from a parsed JWT payload.
   * Usually should be `payload => payload.sub` for most JWT structures.
   */
  userId: (payload: JWTPayload) => UserId;

  /**
   * Get the roles that a user belongs to.
   */
  getRoles: (payload: JWTPayload, userId: UserId) => MaybePromise<any[]>;

  /**
   * A method to fetch a user's details given the user ID embedded in a JWT.
   */
  getUserById: (id: UserId) => MaybePromise<User>;

  /**
   * Store some ACL object for the current user, e.g. an 'Ability' from CASL.
   */
  getAcl?: (payload?: JWTPayload, userId?: UserId) => AbilityType;

}

export interface AuthModuleAsyncOptions<
  JWTPayload extends object,
  User,
  UserId extends string | number = string | number,
> extends Pick<ModuleMetadata, "imports"> {

  /**
   * If set, makes the {@link AuthGuard} the global `APP_GUARD` for all routes.
   * Otherwise, {@link AuthGuard} will be exported as a regular service.
   */
  global?: boolean;

  inject?: any[];

  useFactory?: (...args: any[]) => MaybePromise<AuthModuleOptions<
    JWTPayload,
    User,
    UserId
  >>;
}
