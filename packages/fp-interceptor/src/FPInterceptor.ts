import { isFP } from "@formulaic/fp";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { map, Observable } from "rxjs";
import { InterceptorConfig } from "./InterceptorConfig";

@Injectable()
export class FPInterceptor implements NestInterceptor {

  public constructor(private readonly config: InterceptorConfig = {}) {}

  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        map(data => {
          const response = this.prepareResponse(data);
          return response;
        }),
      );
  }

  protected prepareResponse(data: any) {
    const debug = this.config.debug ?? (process.env.NODE_ENV === "development");
    const info = this.config.info !== false;

    if(isFP(data)) {
      return instanceToPlain(data, {
        groups: this.config.groups ?? [
          ...(debug ? [ "debug" ] : []),
          ...(info ? [ "info" ] : []),
          ...(this.config.additionalGroups ?? []),
        ]
      });
    }
    return data;
  }

}
