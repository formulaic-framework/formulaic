import { TaggedType } from "./interface/TaggedType";

/**
 * An unexpected and unhandled error thrown by a database.
 */
export class DatabaseException<ErrorType = any> {

  public readonly kind: "DatabaseException";

  public readonly hasData: false;

  /**
   * The method called that threw this error.
   */
  public readonly databaseMethod: string;

  /**
   * The unhandled error thrown by the database.
   */
  public readonly error: ErrorType;

  public constructor(
    databaseMethod: string,
    error: ErrorType,
  ) {
    this.kind = "DatabaseException";
    this.databaseMethod = databaseMethod;
    this.error = error;
  }

}

export function isDatabaseException(data: TaggedType): data is DatabaseException {
  return data.kind === "DatabaseException";
}
