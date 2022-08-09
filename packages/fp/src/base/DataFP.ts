import { Data } from "./Data";
import { EnsureFP, MapFP } from "./util";

/**
 * The default class for users to extend with their own FP classes that represent "successful"
 * data.
 */
export abstract class DataFP extends Data<any> {

  public getData(): this {
    return this;
  }

  public override map<O>(fn: (data: this) => O): MapFP<this, O, never> {
    return this.processMap(this, fn) as EnsureFP<O> as MapFP<this, O, never>;
  }

  public override chain<O>(fn: (data: this) => Promise<O>): Promise<MapFP<this, O, never>> {
    return this.processThen(this, fn) as Promise<EnsureFP<O>> as Promise<MapFP<this, O, never>>;
  }

}
