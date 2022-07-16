import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
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

}
