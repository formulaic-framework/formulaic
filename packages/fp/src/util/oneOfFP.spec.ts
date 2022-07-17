import { getSchemaPath } from "@nestjs/swagger";
import { AccessForbidden } from "../AccessForbidden";
import { MissingPermission } from "../MissingPermission";
import { oneOfFP } from "./oneOfFP";

describe("oneOfFP", () => {

  it("handles multiple options", () => {
    const response = oneOfFP([
      AccessForbidden,
      MissingPermission,
    ]);
    expect(response).toStrictEqual({
      schema: {
        oneOf: [
          { $ref: getSchemaPath(AccessForbidden) },
          { $ref: getSchemaPath(MissingPermission) },
        ],
        discriminator: {
          propertyName: "kind",
          mapping: {
            "NotFound": getSchemaPath(AccessForbidden),
            "MissingPermission": getSchemaPath(MissingPermission),
          },
        },
      },
    });
  });

});
