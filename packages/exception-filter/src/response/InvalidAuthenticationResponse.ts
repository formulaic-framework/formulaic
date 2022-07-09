import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals } from "class-validator";
import { StatusResponse } from "../interface/StatusResponse";

export class InvalidAuthenticationResponse implements StatusResponse {

  @ApiProperty()
  @Equals("InvalidAuthenticationResponse")
  @Expose()
  public readonly kind: "InvalidAuthenticationResponse";

  @ApiProperty()
  @Equals(401)
  @Expose()
  public readonly statusCode: 401;

  public constructor() {
    this.kind = "InvalidAuthenticationResponse";
    this.statusCode = 401;
  }

}
