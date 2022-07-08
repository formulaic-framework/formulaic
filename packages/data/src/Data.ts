/**
 * A minimal wrapper around data.
 * Allows a successful response to be differentiated from an error type.
 */
export class Data<T> {

  public readonly kind: "Data";

  public readonly hasData: true;

  public readonly data: T;

  public constructor(
    data: T,
  ) {
    this.kind = "Data";
    this.hasData = true;
    this.data = data;
  }

}
