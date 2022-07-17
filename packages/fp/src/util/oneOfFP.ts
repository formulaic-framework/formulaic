import { ApiResponseOptions, getSchemaPath } from "@nestjs/swagger";
import { Data } from "../base/Data";
import { FP } from "../base/FP"
import { MissingPermission } from "../MissingPermission";

export type FPConstructor<Kind extends string, T extends FP<any>> = {
  kind: Kind;
  new (...args: any[]): T & { kind: Kind };
}

/**
 * Build an OpenAPI schema to document responses that should include
 * a `oneOf` section that lists various {@link FP} responses.
 *
 * @example
 * export class MyController {
 *
 *   @Get("/")
 *   @ApiOkResponse(oneOfFP([
 *     AccessForbidden,
 *     DatabaseException,
 *   ]))
 *   public getResponse() {}
 *
 * }
 */
export function oneOfFP(responses: FPConstructor<string, any>[]): ApiResponseOptions {
  return {
    schema: {
      oneOf: responses.map(response => ({
        $ref: getSchemaPath(response),
      })),
      discriminator: {
        propertyName: "kind",
        mapping: Object.fromEntries(responses.map(response => ([
          response.kind,
          getSchemaPath(response),
        ] as const))),
      },
    },
  };
}

oneOfFP([
  Data,
  MissingPermission,
])
