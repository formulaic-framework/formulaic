import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { MapFP } from "./base/util";
import { UnexpectedError } from "./UnexpectedError";

export class DatabaseException<
  T,
  Method extends string,
  ErrorType = any,
> extends UnexpectedError<T, ErrorType> {

  public override readonly code?: "DatabaseException";

  @ApiPropertyOptional()
  @Expose({
    groups: ["debug"],
  })
  public readonly method?: Method;

  public constructor(
    method: Method,
    error?: ErrorType,
  ) {
    super(error, "DatabaseException");
    this.method = method;
  }

  public override map<O>(fn: (data: T) => O): MapFP<this, O, DatabaseException<O, Method, ErrorType>> {
    return this as unknown as MapFP<this, O, DatabaseException<O, Method, ErrorType>>;
  }

  public override async chain<O>(fn: (data: T) => Promise<O>): Promise<MapFP<this, O, DatabaseException<O, Method, ErrorType>>> {
    return this as unknown as MapFP<this, O, DatabaseException<O, Method, ErrorType>>;
  }

}
