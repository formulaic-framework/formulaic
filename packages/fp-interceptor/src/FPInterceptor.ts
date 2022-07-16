import { isFP } from "@formulaic/fp";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { map, Observable } from "rxjs";

@Injectable()
export class FPInterceptor implements NestInterceptor {

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
    if(isFP(data)) {
      return instanceToPlain(data);
    }
    return data;
  }

}
