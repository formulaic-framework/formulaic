import { TaggedType } from "@formulaic/data";
import { ClassTransformOptions } from "class-transformer";

export interface DefaultExceptionResponse {
  statusCode?: number;

  response?: object;
}

export interface ExceptionFilterConfig {

  default?: "default" | false | DefaultExceptionResponse;

  /**
   * Map exceptions to responses before the main transformations are performed.
   *
   * Can be used to make one exception look like another, e.g. a {@link DatabaseException}
   * could be transformed into a {@link AccessForbiddenException},
   * so both get converted into the same response.
   */
  preMap?: (data: TaggedType) => TaggedType;

  /**
   * Completely replace the built-in transformations of the exception filter.
   */
  map?: (data: TaggedType) => TaggedType;

  /**
   * Map responses to other responses after the main transformations are performed.
   */
  postMap?: (data: TaggedType) => TaggedType;

  /**
   * Configuration passed to `class-transformer`.
   * By default:
   * ```
   * {
   *   strategy: "excludeAll",
   *   groups: process.env.NODE_ENV === "development" ? [ "info", "debug" ] : [ "info" ],
   * }
   * ```
   */
  transformerOptions?: ClassTransformOptions;

  /**
   * The internal exception filter will convert all common Formulaic errors to an instance of
   * {@link StatusResponse}, which is used to signal responses as being ready for transmission.
   *
   * By default, if a response does not extend {@link StatusResponse}, we still run it through
   * `class-transformer` (which will remove all properties on an object that isn't ready to be exposed to the world),
   * and uses status code `500`.
   *
   * Provide a number to change the default status code that is returned.
   *
   * Alternatively, use `"default"` to return a generic "Internal Server Error" response when
   * encountering a non-{@link StatusResponse} value, assuming that objects that are not
   * status responses aren't intended for the public.
   */
  ifNotStatusResponse?: "default" | number;

}
