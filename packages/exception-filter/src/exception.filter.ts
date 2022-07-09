import { ArgumentsHost, Catch, ExceptionFilter, HttpAdapterHost } from "@nestjs/common";
import {
  isDatabaseException,
  isEntityNotFound,
  isInvalidAuthenticationException,
  isTaggedType,
  isUnparsableJwtException,
  TaggedType,
} from "@formulaic/data";
import { ExceptionFilterConfig } from "./exception-filter-config";
import { isStatusResponse } from "./interface/StatusResponse";
import { instanceToPlain } from "class-transformer";
import { ForbiddenResponse } from "./response/ForbiddenResponse";
import { InternalException } from "./response/InternalException";
import { NotFoundResponse } from "./response/NotFoundResponse";
import { InvalidAuthenticationResponse } from "./response/InvalidAuthenticationResponse";
import { UnparsableJwtResponse } from "./response/UnparsableJwtResponse";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {

  public constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly config: ExceptionFilterConfig = {},
  ) {}

  public catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const defaultResponse = this.config.default;

    if(!isTaggedType(exception) && defaultResponse === false) {
      throw exception;
    }

    const defaultResponseObj = defaultResponse && defaultResponse !== "default"
      ? defaultResponse
      : undefined;

    const defaultStatus = defaultResponseObj?.statusCode ?? 500;
    const defaultBody = defaultResponseObj?.response ?? {
      statusCode: defaultStatus,
    };

    if(!isTaggedType(exception)) {
      httpAdapter.reply(ctx.getResponse(), defaultBody, defaultStatus);
      return;
    }

    const preprocessed = this.config.preMap ? this.config.preMap(exception) : exception;
    const processed = this.config.map ? this.config.map(preprocessed) : this.process(exception);
    const postProcessed = this.config.postMap ? this.config.postMap(processed) : processed;

    const hasStatus = isStatusResponse(postProcessed);

    if(!hasStatus && this.config.ifNotStatusResponse === "default") {
      httpAdapter.reply(ctx.getResponse(), defaultBody, defaultStatus);
      return;
    }

    const statusCode = hasStatus
      ? postProcessed.statusCode
      : typeof this.config.ifNotStatusResponse === "number"
        ? this.config.ifNotStatusResponse
        : 500;

    const formatted = instanceToPlain(postProcessed, this.config.transformerOptions ?? {
      strategy: "excludeAll",
      groups: process.env.NODE_ENV === "development" ? [ "info", "debug" ] : [ "info" ],
    });

    httpAdapter.reply(ctx.getResponse(), formatted, statusCode);
  }

  protected process(exception: TaggedType): TaggedType {
    if(exception.kind === "AccessForbiddenException") {
      exception = new ForbiddenResponse();
    }

    if(isDatabaseException(exception)) {
      exception = new InternalException("database", exception.error);
    }

    if(isEntityNotFound(exception)) {
      exception = new NotFoundResponse(exception.entityName, exception.findOptions);
    }

    if(isInvalidAuthenticationException(exception)) {
      exception = new InvalidAuthenticationResponse();
    }

    if(isUnparsableJwtException(exception)) {
      exception = new UnparsableJwtResponse(exception.reason);
    }

    return exception;
  }

}
