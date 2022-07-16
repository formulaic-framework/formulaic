import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { serializeError } from "serialize-error";
import { FP } from "./base/FP";

/**
 * Describes unexpected encountered on the server-side.
 * This is a catch-all equivalent for a 500 Internal Server Error.
 */
export class UnexpectedError<T, Err = any> extends FP<T> {

  @ApiProperty()
  @Expose()
  public override readonly kind: "UnexpectedError";

  @ApiProperty()
  @Expose()
  public override readonly status: 500;

  @ApiPropertyOptional()
  @Transform(({value, options}) => {
    if(!value) {
      return;
    }
    if(options.groups.includes("debug") || options.groups.includes("info") || options.groups.includes("exposeUnexpectedType")) {
      return value;
    }
    return;
  })
  public readonly code?: string;

  @ApiProperty()
  @Expose()
  public override readonly hasData: false;

  @ApiProperty()
  @Expose()
  public override readonly noValue: false;

  public readonly error?: Err;

  @ApiPropertyOptional()
  @Expose({
    groups: ["debug"],
  })
  public readonly serializedError?: string;

  public constructor(
    error?: Err,
    code?: string,
  ) {
    super();
    this.kind = "UnexpectedError";
    this.status = 500;
    this.code = code;
    this.hasData = false;
    this.noValue = false;
    this.error = error;
    this.serializedError = error ? JSON.stringify(serializeError(error)) : undefined;
  }

}
