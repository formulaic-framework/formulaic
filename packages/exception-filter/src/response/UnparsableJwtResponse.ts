import { UnparsableJwtReason } from "@formulaic/data";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals, IsEnum, IsOptional } from "class-validator";
import { StatusResponse } from "../interface/StatusResponse";

export class UnparsableJwtResponse implements StatusResponse {

  @ApiProperty()
  @Equals("UnparsableJwtResponse")
  @Expose()
  public readonly kind: "UnparsableJwtResponse";

  @ApiProperty()
  @Equals(401)
  @Expose()
  public readonly statusCode: 401;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UnparsableJwtReason)
  @Expose({
    groups: [ "info" ],
  })
  public readonly reason?: UnparsableJwtReason;

  public constructor(
    reason: UnparsableJwtReason,
  ) {
    this.kind = "UnparsableJwtResponse";
    this.statusCode = 401;
    this.reason = reason;
  }

}
