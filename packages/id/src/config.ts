export const MAX_NOLOOKALIKES_SIZE = {
  hundred: 4,
  thousand: 5,
  thousands: 6,
  tens_of_thousands: 7,
  hundred_thousand: 8,
  million: 9,
  millions: 10,
  fifty_million: 11,
  hundred_million: 12,
  billion: 13,
} as const;

export const MAX_ALPHANUMERIC_SIZE = {
  hundreds: 4,
  thousands: 5,
  tens_of_thousands: 6,
  hundred_thousands: 7,
  millions: 8,
  ten_million: 9,
  hundred_million: 10,
  billion: 11,
} as const;

export type IDDefinition
  = readonly ["safe", keyof typeof MAX_NOLOOKALIKES_SIZE]
  | readonly ["alphanumeric", keyof typeof MAX_ALPHANUMERIC_SIZE]
  | "uuid";

export type IDConfig = Record<string, IDDefinition>;

export interface IDModuleConfig<
  IDs extends IDConfig = IDConfig,
> {
  ids: IDs;
}

export const ID_MODULE_CONFIG = "IDModuleConfig";
