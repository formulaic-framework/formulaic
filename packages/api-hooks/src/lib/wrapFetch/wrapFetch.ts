import { EnsureFP, isFP, Literal } from "@formulaic/base-fp";
import { FailedRequest } from "../dto/FailedRequest";
import { FPParser } from "./parsers/fp";
import { OpenAPITypescriptCodegenParser } from "./parsers/openapi-typescript-codegen";

/**
 * Wraps a function that calls `fetch` to ensure all responses are `FP` instances,
 * catching standard HTTP error responses.
 */
export async function wrapFetch<Res>(fn: () => Promise<Res>): Promise<EnsureFP<Res> | FailedRequest<Res, any, number>> {
  try {
    const res = await fn();
    if(isFP(res)) {
      return res as any as EnsureFP<Res>;
    }
    return new Literal<Res>(res) as EnsureFP<Res>;
  } catch (e) {
    if(FPParser.isFP(e)) {
      return FPParser.process(e) as any as EnsureFP<Res>;
    }
    if(OpenAPITypescriptCodegenParser.isApiError(e)) {
      return OpenAPITypescriptCodegenParser.process<Res>(e);
    }
    return new FailedRequest<Res, null, 500>(null, 500);
  }
}
