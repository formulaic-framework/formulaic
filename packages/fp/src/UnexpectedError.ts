import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { serializeError } from "serialize-error";
import { ErrorFP } from "./base/ErrorFP";
import { MapFP } from "./base/util";

/**
 * Describes unexpected encountered on the server-side.
 * This is a catch-all equivalent for a 500 Internal Server Error.
 */
export class UnexpectedError<T, Err = any> extends ErrorFP<T> {
  public static readonly kind = "UnexpectedError";

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
    if(!options || !options.groups || !Array.isArray(options.groups)) {
      return;
    }
    if(options.groups.includes("debug") || options.groups.includes("info") || options.groups.includes("exposeUnexpectedType")) {
      return value;
    }
    return;
  })
  public readonly code?: string;

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
    this.error = error;
    this.serializedError = error ? JSON.stringify(serializeError(error)) : undefined;
  }

  public override map<O>(fn: (data: T) => O): MapFP<this, O, UnexpectedError<O, Err>> {
    return this as unknown as MapFP<this, O, UnexpectedError<O, Err>>;
  }

  public override async chain<O>(fn: (data: T) => Promise<O>): Promise<MapFP<this, O, UnexpectedError<O, Err>>> {
    return this as unknown as MapFP<this, O, UnexpectedError<O, Err>>;;
  }

}
