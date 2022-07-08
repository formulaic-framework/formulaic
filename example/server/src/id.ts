export const IDs = {

  article: "uuid",

  draft: ["alphanumeric", 12],

  comment: ["alphanumeric", "billion"],

  user: ["safe", "millions"],

} as const;

export type ID = typeof IDs;
