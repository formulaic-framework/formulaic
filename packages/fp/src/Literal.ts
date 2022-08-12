import { Data } from "./base/Data";
import { EnsureFP, FP, isFP } from "./base/FP";

/**
 * Simple instance of a {@link FP} {@link Data} class that simply wraps another data structure.
 *
 * Allows you to represent arbitrary data (including non-objects) without defining a {@link FP} class,
 * however it nests all data under the `data` property.
 */
export class Literal<T> extends Data<T, "Literal", 200 | 201> {
  public static readonly kind = "Literal";

  public override readonly kind: "Literal";
  public override readonly status: 200 | 201;

  public readonly data: T;

  public constructor(data: T, created = false) {
    super();
    this.kind = "Literal";
    this.status = created ? 201 : 200;
    this.data = data;
  }

  public getData(): T {
    return this.data;
  }

  public map<O>(fn: (data: T) => O): EnsureFP<O> {
    return this.processMap(this.data, fn);
  }

  public chain<O>(fn: (data: T) => Promise<O>): Promise<EnsureFP<O>> {
    return this.processThen(this.data, fn);
  }

  public override get [Symbol.toStringTag]() {
    return `Literal<${typeof this.data}>`;
  }

  protected override inspectTag(depth: number | null, options: any, inspect: any): string {
    const _tag = (str: string) => options.stylize(str, "special");
    return `${_tag("Literal<")}${this.inspectTagType(depth, options, inspect)}${_tag(">")}`;
  }

  private inspectTagType(depth: number | null, options: any, inspect: any): string {
    switch(typeof this.data) {
      case "string":
        return options.stylize(typeof this.data, "string");
      case "number":
        return options.stylize(typeof this.data, "number");
      default:
        return options.stylize(typeof this.data, "undefined");
    }
  }

  /* istanbul ignore next */
  protected override inspectValue(depth: number | null, options: any, inspect: any): string {
    if(inspect && typeof inspect === "function") {
      return inspect(this.data, depth, options);
    }
    switch(typeof this.data) {
      case "string":
        return options.stylize(`"${this.data}"`, "string");
      case "number":
        return options.stylize(this.data, "number");
    }
    return JSON.stringify(this.data);
  }

  protected ensureFP<O>(value: O): EnsureFP<O> {
    if(isFP(value)) {
      return value as EnsureFP<O>;
    }
    return new Literal(value) as FP<O, "Literal", 200 | 201, true, false, false> as EnsureFP<O>;
  }

}
