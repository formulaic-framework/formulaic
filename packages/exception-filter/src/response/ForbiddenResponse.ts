import { ApiProperty } from "@nestjs/swagger";
import { Equals, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { TaggedType } from "@formulaic/data";

export class ForbiddenResponse implements TaggedType {

  @ApiProperty()
  @Equals("ForbiddenResponse")
  @Expose()
  public readonly kind: "ForbiddenResponse";

  @ApiProperty()
  @Equals(403)
  @Expose()
  public readonly statusCode: 403;

  @ApiProperty()
  @IsString()
  @Expose()
  public readonly message: string;

  public constructor(
    message = "Forbidden",
  ) {
    this.kind = "ForbiddenResponse";
    this.statusCode = 403;
    this.message = message;
  }

}
