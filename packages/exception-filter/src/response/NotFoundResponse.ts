import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals, IsJSON, IsOptional, IsString } from "class-validator";
import { StatusResponse } from "../interface/StatusResponse";

export class NotFoundResponse implements StatusResponse {

  @ApiProperty()
  @Equals("NotFoundResponse")
  @Expose()
  public readonly kind: "NotFoundResponse";

  @ApiProperty()
  @Equals(404)
  @Expose()
  public readonly statusCode: 404;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose({
    groups: [ "info" ],
  })
  public readonly entityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  @Expose({
    groups: [ "debug" ],
  })
  public readonly query?: string;

  public constructor(
    entityType: string,
    query: any,
  ) {
    this.kind = "NotFoundResponse";
    this.statusCode = 404;
    this.entityType = entityType;
    this.query = JSON.stringify(query);
  }

}
