import { createParamDecorator, ExecutionContext, InternalServerErrorException, SetMetadata } from "@nestjs/common";
import type { Request } from "express";
import { AUTH_FETCH_COMPLETE_USER, AUTH_ROUTE_PUBLIC, AUTH_ROUTE_REQUIRE_ONE_OF_ROLES, AUTH_ROUTE_REQUIRE_ROLES } from "./auth.constants";
import { AuthContext } from "./AuthContext";

export const Public = () => SetMetadata(AUTH_ROUTE_PUBLIC, true);

export const Private = () => SetMetadata(AUTH_ROUTE_PUBLIC, false);

export const ParseUser = () => SetMetadata(AUTH_FETCH_COMPLETE_USER, true);

export const RequireRoles = (...roles: any[]) => SetMetadata(AUTH_ROUTE_REQUIRE_ROLES, roles);

export const RequireOneOfRole = (...roles: any[]) => SetMetadata(AUTH_ROUTE_REQUIRE_ONE_OF_ROLES, roles);

export const CurrentUserId = createParamDecorator<boolean | undefined>(
  (optional, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const session: undefined | AuthContext<any, any> = (req as any).session;

    if(optional !== true && (!session || !session.user)) {
      throw new InternalServerErrorException();
    }

    if(!session.user) {
      return undefined;
    }

    return session.user.id;
  },
);

/**
 * Returns a `Promise` that contains the current user.
 */
export const CurrentUserFetch = createParamDecorator<boolean | undefined>(
  (optional, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const session: undefined | AuthContext<any, any> = (req as any).session;

    if(optional !== true && (!session || !session.user)) {
      throw new InternalServerErrorException();
    }

    if(!session.user) {
      return undefined;
    }

    return session.user.getUser();
  },
);

/**
 * Retrieve the complete user identity associated with the current request.
 *
 * You must have added the {@link ParseUser()} decorator to the method or class
 * before using this method, otherwise the user won't be parsed in time.
 *
 * (You may alternatively use the {@link CurrentUserFetch}) parameter
 * which doesn't require parsing the user)
 */
export const CurrentUser = createParamDecorator<boolean | undefined>(
  (optional, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const session: undefined | AuthContext<any, any> = (req as any).session;

    if(optional !== true && (!session || !session.user || !session.user.user)) {
      throw new InternalServerErrorException();
    }

    if(!session.user) {
      return undefined;
    }

    return session?.user.user;
  },
);

export const CurrentJWT = createParamDecorator<boolean | undefined>(
  (optional, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const session: undefined | AuthContext<any, any> = (req as any).session;

    if(optional !== true && (!session || !session.user || !session.user.jwt)) {
      throw new InternalServerErrorException();
    }

    if(session?.user === false) {
      return undefined;
    }

    return session?.user?.jwt;
  },
);

export const Acl = createParamDecorator<boolean | undefined>(
  (optional, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const session: undefined | AuthContext<any, any> = (req as any).session;

    if(optional !== true && (!session || !session.acl)) {
      throw new InternalServerErrorException();
    }

    return session?.acl;
  },
);
