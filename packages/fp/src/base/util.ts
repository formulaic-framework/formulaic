import type { Literal } from "../Literal";

type KindSpec<K extends string>
  = K
  | { kind: K };

export type KindSelection<K extends string>
  = KindSpec<K>
  | KindSpec<K>[];

export type FPFields<T extends {
  kind: string;
  status: number;
  hasData: boolean;
  hasError: boolean;
  noValue: boolean;
}> = Pick<T, "kind" | "status" | "hasData" | "hasError" | "noValue">;

export type EnsureFP<O> = O extends { kind: string } ? O : Literal<O>;

export type Alt<
  T extends { noValue: boolean },
  O,
> = T extends { noValue: true } ? EnsureFP<O> : T;

export type Or<
  T extends { hasError: boolean, noValue: boolean },
  O,
> = T extends { hasError: true }
  ? EnsureFP<O>
  : T extends { noValue: true }
    ? EnsureFP<O>
    : T;

export type MapFP<
  T extends { hasData: boolean },
  O,
  Return,
> = T extends { hasData: true } ? EnsureFP<O> : Return;

export type MapFPIf<
  T extends { kind: string },
  K,
  O,
> = T extends { kind: K } ? EnsureFP<O> : T;
