/**
 * A set of properties used to track a single execution of a query
 * in {@link useQuery}, to bundle all relevant properties.
 */
export class QueryContext<Args extends any[]> {

  /**
   * An index of this query, determining a sequential order
   * of queries.
   */
  public readonly index: number;

  public readonly args: Args;

  public constructor(
    index: number,
    args: Args,
  ) {
    this.index = index;
    this.args = args;
  }

  public before(ctx: QueryContext<any>): boolean {
    return this.index < ctx.index;
  }

}
