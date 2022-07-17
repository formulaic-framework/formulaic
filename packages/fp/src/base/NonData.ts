import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { FP } from "./FP";

/**
 * Base class for all entities that are not {@link Data}
 * or {@link NoData} - sets `hasData`, etc.
 */
export abstract class NonData<T> extends FP<T> {

  @ApiProperty()
  @Expose()
  public override readonly hasData: false;

  @ApiProperty()
  @Expose()
  public override readonly noValue: false;

  public constructor() {
    super();
    this.hasData = false;
    this.noValue = false;
  }
}
