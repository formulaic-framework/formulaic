import { FP, isFP } from "./FP";
import { Literal } from "../Literal";
import { Alt, EnsureFP, MapFP, Or } from "./util";

/**
 * One of the {@link FP} core interfaces, representing responses that have some failure
 * or issue associated with them.
 *
 * The {@link BaseErrorFP} assumes that being in an error state is mutually exclusive
 * with having data (setting {@link hasData} to `false`), however it does not set {@link noValue},
 * allowing cases where there is both some failure as well as an importance to signify that
 * data is specifically missing and a default may make sense.
 *
 * In practice, most error responses do not signify `noValue` to be `true`, so users may
 * prefer to use {@link ErrorFP}.
 */
export abstract class BaseErrorFP<
  T,
  ErrorValue = any,
  StatusCode extends number = number,
  NoValue extends boolean = boolean,
> extends FP<T> {
  public override readonly status: StatusCode;
  public override readonly hasData: false;
  public override readonly hasError: true;
  public override readonly noValue: NoValue;

  public readonly error?: ErrorValue;

  public override or<O>(fn: () => O): Or<this, O> & EnsureFP<O> {
    const value = fn();
    return this.orValue(value);
  }

  public override async orThen<O>(fn: () => Promise<O>): Promise<Or<this, O> & EnsureFP<O>> {
    return this.orValue(await fn());
  }

  public override orValue<O>(value: O): Or<this, O> & EnsureFP<O> {
    return this.ensureFP(value) as (Or<this, O> & EnsureFP<O>);
  }

  public override map<O>(fn: (value: T) => O): MapFP<this, O, BaseErrorFP<O, ErrorValue, StatusCode, NoValue>> {
    return this as unknown as BaseErrorFP<O, ErrorValue, StatusCode, NoValue> as MapFP<this, O, BaseErrorFP<O, ErrorValue, StatusCode, NoValue>>;
  }

  public override async chain<O>(fn: (value: T) => Promise<O>): Promise<MapFP<this, O, BaseErrorFP<O, ErrorValue, StatusCode, NoValue>>> {
    return this as unknown as BaseErrorFP<O, ErrorValue, StatusCode, NoValue> as MapFP<this, O, BaseErrorFP<O, ErrorValue, StatusCode, NoValue>>;
  }

  public constructor(
    noValue: NoValue,
    statusCode: StatusCode,
    error?: ErrorValue,
  ) {
    super();
    this.status = statusCode;
    this.hasData = false;
    this.hasError = true;
    this.noValue = noValue;
    this.error = error;
  }

  protected override ensureFP<O>(value: O): EnsureFP<O> {
    if(isFP(value)) {
      return value as EnsureFP<O>;
    }
    return new Literal(value) as EnsureFP<O>;
  }

}

/**
 * A variant of the {@link BaseErrorFP} core interface of {@link FP}
 * representing the majority of "error"/"failure" responses.
 */
export abstract class ErrorFP<
  T,
  ErrorValue = any,
  StatusCode extends number = number,
> extends BaseErrorFP<T, ErrorValue, StatusCode, false> {

  public constructor(error?: ErrorValue, statusCode?: StatusCode) {
    super(false, statusCode, error);
  }

  public override alt<O>(fn: () => O): Alt<this, O> & this {
    return this as (Alt<this, O> & this);
  }

  public override async altThen<O>(fn: () => Promise<O>): Promise<Alt<this, O> & this> {
    return this as (Alt<this, O> & this);
  }

  public override altValue<O>(value: O): Alt<this, O> & this {
    return this as (Alt<this, O> & this);
  }

  public override map<O>(fn: (value: T) => O): MapFP<this, O, ErrorFP<O, ErrorValue, StatusCode>> {
    return this as unknown as ErrorFP<O, ErrorValue, StatusCode> as MapFP<this, O, ErrorFP<O, ErrorValue, StatusCode>>;
  }

  public override async chain<O>(fn: (value: T) => Promise<O>): Promise<MapFP<this, O, ErrorFP<O, ErrorValue, StatusCode>>> {
    return this as unknown as ErrorFP<O, ErrorValue, StatusCode> as MapFP<this, O, ErrorFP<O, ErrorValue, StatusCode>>;
  }

}
