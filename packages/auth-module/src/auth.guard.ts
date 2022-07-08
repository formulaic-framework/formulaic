import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { AccessForbiddenException, InvalidAuthenticationException, InvalidAuthenticationReason, UnparsableJwtException, UnparsableJwtReason } from "@formulaic/data";
import type { Request } from "express";
import type { Socket } from "socket.io";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { transformAndValidate } from "class-transformer-validator";
import { AUTH_FETCH_COMPLETE_USER, AUTH_MODULE_OPTIONS, AUTH_ROUTE_PUBLIC, AUTH_ROUTE_REQUIRE_ONE_OF_ROLES, AUTH_ROUTE_REQUIRE_ROLES } from "./auth.constants";
import { AuthModuleOptions } from "./AuthModuleOptions";
import { Reflector } from "@nestjs/core";
import { AuthContext } from "./AuthContext";
import { UserContext } from "./UserContext";

const NO_JWT_PROVIDED = Symbol("NO_JWT_PROVIDED");

@Injectable()
export class AuthGuard<
  JWTPayload extends object = object,
  User = any,
> implements CanActivate {

  public constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly options: AuthModuleOptions<JWTPayload, User>,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = new AuthContext();
    this.attachContext(context, ctx);
    const routePolicy = this.routePolicy(context);
    const jwtValue = this.getJwt(context);
    if(jwtValue === NO_JWT_PROVIDED) {
      if(routePolicy === "deny") {
        return false;
      }
      if(this.options.getAcl) {
        const acl = await this.options.getAcl();
        ctx.setAcl(acl);
      }
      ctx.setNoUser();
      return true;
    }

    let rawPayload: JWTPayload;

    try {
      rawPayload = verify(jwtValue, this.options.secretOrPublicKey, this.options.jwtOptions) as JWTPayload;
    } catch (e: any) {
      if(e instanceof TokenExpiredError) {
        throw new InvalidAuthenticationException(InvalidAuthenticationReason.EXPIRED);
      } else if(e instanceof JsonWebTokenError && e.message !== "invalid token" && e.message !== "jwt malformed") {
        throw new UnparsableJwtException(UnparsableJwtReason.INVALID_TOKEN);
      }
      throw new UnparsableJwtException(UnparsableJwtReason.NOT_JWT);
    }

    let payload: JWTPayload;

    try {
      payload = await transformAndValidate(this.options.payload, rawPayload);
    } catch (e) {
      throw new UnparsableJwtException(UnparsableJwtReason.INVALID_STRUCTURE);
    }

    const userId = this.options.userId(payload);

    const roles = await Promise.resolve(this.options.getRoles(payload, userId));

    const requiredRolesAll = this.getMetadata<any[]>(context, AUTH_ROUTE_REQUIRE_ROLES);
    if(requiredRolesAll && Array.isArray(requiredRolesAll) && requiredRolesAll.length > 0) {
      for (const requiredRole of requiredRolesAll) {
        if(!roles.includes(requiredRole)) {
          throw new AccessForbiddenException();
        }
      }
    }

    const requiredRolesOneOf = this.getMetadata<any[]>(context, AUTH_ROUTE_REQUIRE_ONE_OF_ROLES);
    if(requiredRolesOneOf && Array.isArray(requiredRolesOneOf) && requiredRolesOneOf.length > 0) {
      const matchedRole = requiredRolesOneOf.find(requiredRole => roles.includes(requiredRole));
      if(!matchedRole) {
        throw new AccessForbiddenException();
      }
    }

    const fetchCompleteUser = this.getMetadata<boolean>(context, AUTH_FETCH_COMPLETE_USER);
    let user: User | undefined = undefined;
    if(fetchCompleteUser === true) {
      user = await Promise.resolve(this.options.getUserById(userId));
    }

    const getUser = () => {
      if(user !== undefined) {
        return user;
      }
      return this.options.getUserById(userId);
    }

    if(this.options.getAcl) {
      const acl = this.options.getAcl(payload, userId);
      ctx.setAcl(acl);
    }

    const userContext: UserContext<User> = {
      id: userId,
      jwt: payload,
      user,
      getUser,
      roles,
    };
    ctx.setUser(userContext);

    return true;
  }

  protected getJwt(context: ExecutionContext): string | typeof NO_JWT_PROVIDED {
    if(context.getType() === "http") {
      const req = context.switchToHttp().getRequest<Request>();
      const { authorization } = req.headers;
      if(!authorization || authorization.length === 0) {
        return NO_JWT_PROVIDED;
      }
      if(!authorization.toLowerCase().startsWith("bearer ")) {
        throw new UnparsableJwtException(UnparsableJwtReason.AUTH_HEADER_UNPARSABLE);
      }
      const [, jwt] = authorization.split(" ");
      return jwt;
    } else if(context.getType() === "ws") {
      const socket = context.switchToWs().getClient<Socket>();
      const { authorization } = socket.handshake.headers;
      if(!authorization || authorization.length === 0) {
        return NO_JWT_PROVIDED;
      }
      if(!authorization.toLowerCase().startsWith("bearer ")) {
        throw new UnparsableJwtException(UnparsableJwtReason.AUTH_HEADER_UNPARSABLE, true);
      }
      const [, jwt] = authorization.split(" ");
      return jwt;
    } else {
      throw new UnparsableJwtException(UnparsableJwtReason.REQUEST_TYPE);
    }
  }

  private routePolicy(context: ExecutionContext): "allow" | "deny" {
    const setting = this.getMetadata<boolean>(context, AUTH_ROUTE_PUBLIC);
    if(setting === true) {
      return "allow";
    } else if(setting === false) {
      return "deny";
    } else {
      return this.options.defaultPolicy;
    }
  }

  private getMetadataOrDefault<T>(context: ExecutionContext, key: string, defaultValue: T): T {
    const setValue = this.getMetadata<T>(context, key);
    if(setValue !== undefined) {
      return setValue;
    }
    return defaultValue;
  }

  private getMetadata<T>(context: ExecutionContext, key: string): T | undefined {
    const value = this.reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
    return value;
  }

  private attachContext(context: ExecutionContext, ctx: AuthContext<any, any>): void {
    if(context.getType() === "http") {
      const req = context.switchToHttp().getRequest<Request>();
      (req as any).session = ctx;
    }
  }

}
