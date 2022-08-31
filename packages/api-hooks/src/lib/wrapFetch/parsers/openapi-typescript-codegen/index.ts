import { EnsureFP } from "@formulaic/base-fp";
import type { ApiError } from "../../../../helpers/generated";
import { FailedRequest } from "../../../dto/FailedRequest";
import { FPParser } from "../fp";

function hasNameField(obj: object): obj is { name: string } {
  const x = obj as any;
  return typeof x.name === "string";
}

export class OpenAPITypescriptCodegenParser {

  public static isApiError(res: unknown): res is ApiError {
    return !!res
      && typeof res === "object"
      && res instanceof Error
      && hasNameField(res)
      && res.name === "ApiError";
  }

  public static process<Res>(res: ApiError): FailedRequest<Res, ApiError, number> | EnsureFP<Res> {
    if(FPParser.isFP(res.body)) {
      return FPParser.process(res.body) as any as EnsureFP<Res>;
    }
    try {
      const parsedBody = JSON.parse(res.body);
      if(FPParser.isFP(parsedBody)) {
        return FPParser.process(parsedBody) as any as EnsureFP<Res>;
      }
    } catch (e) {}
    return new FailedRequest<Res, ApiError, number>(res, res.status);
  }

}
