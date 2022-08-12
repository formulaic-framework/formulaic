import { Literal } from "../Literal";
import { Data } from "./Data";
import { EnsureFP, FP, isFP } from "./FP";

/**
 * The default class for users to extend with their own FP classes that represent "successful"
 * data.
 */
export abstract class DataFP<Kind extends string, Status extends number = 200 | 201> extends Data<any, Kind, Status> {

  public getData(): this {
    return this;
  }

  public override map<O>(fn: (data: this) => O): EnsureFP<O> {
    return this.processMap(this, fn);
  }

  public override chain<O>(fn: (data: this) => Promise<O>): Promise<EnsureFP<O>> {
    return this.processThen(this, fn) as Promise<EnsureFP<O>>;
  }

  protected override ensureFP<O>(value: O): EnsureFP<O> {
    if(isFP(value)) {
      return value as EnsureFP<O>;
    }
    return new Literal(value) as FP<O, "Literal", 200 | 201, true, false, false> as EnsureFP<O>;
  }

}
