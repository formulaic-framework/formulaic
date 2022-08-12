type KindSpec<K extends string>
  = K
  | { kind: K };

export type KindSelection<K extends string>
  = KindSpec<K>
  | KindSpec<K>[];
