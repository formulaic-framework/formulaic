import { TaggedType } from "@formulaic/data";

export interface StatusResponse extends TaggedType {
  statusCode: number;
}

export function isStatusResponse(data: TaggedType): data is StatusResponse {
  return typeof data["statusCode"] === "number";
}
