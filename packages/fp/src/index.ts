// Base 'FP' type

export { FP } from "./base/FP";

// Core FP interfaces
export { Data } from "./base/Data";
export { DataFP } from "./base/DataFP";
export { BaseErrorFP, ErrorFP } from "./base/ErrorFP";
export { NoValue } from "./base/NoValue";

// Not Found types
export { AccessForbidden } from "./not-found/AccessForbidden";
export { EntityNotFound } from "./not-found/EntityNotFound";
export { NotFound } from "./not-found/NotFound";

// Common FP types
export { Empty } from "./Empty";
export { Literal } from "./Literal";

// Common FP errors
export { DatabaseException } from "./DatabaseException";
export { MissingPermission } from "./MissingPermission";
export { UnexpectedError } from "./UnexpectedError";

// Utilities
export {
  Alt,
  EnsureFP,
  ExtractFPType,
  Map,
  MapIf,
  Or,
  isFP,
} from "./base/FP";
export {
  KindSelection,
} from "@formulaic/base-fp";
export { FPConstructor, oneOfFP } from "./util/oneOfFP";
