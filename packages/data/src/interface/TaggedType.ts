export interface TaggedType {

  readonly kind: string;

}

export function isTaggedType(obj: any): obj is TaggedType {
  return obj && typeof obj === "object" && typeof obj["kind"] === "string";
}
