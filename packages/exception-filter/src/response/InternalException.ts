import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals, IsJSON, IsOptional, IsString } from "class-validator";
import { StatusResponse } from "../interface/StatusResponse";

export class InternalException implements StatusResponse {

  @ApiProperty()
  @Equals("InternalException")
  @Expose()
  public readonly kind: "InternalException";

  @ApiProperty()
  @Equals(500)
  @Expose()
  public readonly statusCode: 500;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose({
    groups: [ "info" ],
  })
  public readonly service?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  @Expose({
    groups: [ "debug" ],
  })
  public readonly error?: string;

  public constructor(
    service?: string,
    error?: any,
  ) {
    this.kind = "InternalException";
    this.statusCode = 500;
    this.service = service;
    this.error = JSON.stringify(error);
  }

}
