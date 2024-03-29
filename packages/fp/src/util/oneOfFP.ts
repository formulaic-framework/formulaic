import { ApiResponseSchemaHost, getSchemaPath } from "@nestjs/swagger";
import { FP } from "../base/FP";

export type FPConstructor<Kind extends string, T extends FP<any, any, any, any, any, any>> = {
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
export function oneOfFP(responses: FPConstructor<string, any>[]): ApiResponseSchemaHost {
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
