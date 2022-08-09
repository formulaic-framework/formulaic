import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals, IsIn, IsJWT, IsString } from "class-validator";
import { Empty } from "../Empty";
import { Literal } from "../Literal";
import { DataFP } from "./DataFP";

export class LoginResponse extends DataFP {
  public static readonly kind = "LoginResponse";

  @ApiProperty()
  @Equals("LoginResponse")
  @Expose()
  public override readonly kind: "LoginResponse";

  @ApiProperty()
  @IsIn([200, 201])
  @Expose()
  public override readonly status: 200 | 201;

  @ApiProperty()
  @IsString()
  @Expose()
  public readonly id: string;

  @ApiProperty()
  @IsJWT()
  @Expose()
  public readonly jwt: string;

  public constructor(
    id: string,
    jwt: string,
    newRegistration: boolean = false,
  ) {
    super();
    this.kind = "LoginResponse";
    this.status = newRegistration ? 201 : 200;
    this.id = id;
    this.jwt = jwt;
  }
}

const USER_ID = "admin";
const JWT = "test_jwt";

const LOGIN_RESPONSE = new LoginResponse(USER_ID, JWT);

describe("DataFP", () => {

  it("contains FP properties", () => {
    expect(LOGIN_RESPONSE.hasData).toBe(true);
  });

  it("contains custom properties", () => {
    expect(LOGIN_RESPONSE.id).toBe(USER_ID);
  });

  describe("getData()", () => {

    it("returns the entire class", () => {
      expect(LOGIN_RESPONSE.getData()).toStrictEqual(LOGIN_RESPONSE);
    });

    it("is interchangeable with Literal#getData()", () => {
      const loginLiteral = new Literal(LOGIN_RESPONSE);
      const response = loginLiteral.getData();
      expect(response).toStrictEqual(LOGIN_RESPONSE.getData());
    });

  });

  describe("map", () => {

    it("can transform data", () => {
      const id = LOGIN_RESPONSE.map(i => i.id);
      expect(id.data).toBe(USER_ID);
    });

    it("handles returned FP instances", () => {
      const mapped = LOGIN_RESPONSE.map(i => new Empty());
      expect(mapped.kind).toBe("Empty");
    });

  });

  describe("chain", () => {

    it("can transform data", async () => {
      const id = await LOGIN_RESPONSE.chain(async i => Promise.resolve(i.id));
      expect(id.data).toBe(USER_ID);
    });

    it("handles resolved FP instances", async () => {
      const chained = await LOGIN_RESPONSE.chain(async i => Promise.resolve(new Empty()));
      expect(chained.kind).toBe("Empty");
    });

  });

});
