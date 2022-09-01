import { FP, isFP } from "@formulaic/base-fp";

export class FPParser {

  public static isFP<T = unknown>(res: any): res is FP<T, string, number, boolean, boolean, boolean> {
    return isFP<T>(res);
  }

  public static process<T = unknown>(res: FP<T, string, number, boolean, boolean, boolean>): FP<T, string, number, boolean, boolean, boolean> {
    return res;
  }

}
