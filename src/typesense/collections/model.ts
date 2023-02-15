type FieldType =
  | "string"
  | "int32"
  | "int64"
  | "float"
  | "bool"
  | "geopoint"
  | "geopoint[]"
  | "string[]"
  | "int32[]"
  | "int64[]"
  | "float[]"
  | "bool[]"
  // @TODO Seems like objects are objects without pre-defined form, or structural checks, so cannot type check them
  //       Raise issue about this?
  | "object"
  | "object[]"
  | "auto"
  | "string*";

type CollectionFieldSchema = {
  name: string;
  type: FieldType;
  facet?: boolean;
  sort?: boolean;
  locale?: string;
  infix?: boolean;
  num_dim?: number;
  // @TODO What is this? Investigate further, maybe ask in an issue, especially regarding object type
  // [t: string]: unknown;
} & ({ optional: true; index: true } | { optional?: boolean; index?: false });

type CollectionCreateSchema = {
  name: string;
  fields: CollectionFieldSchema[];
  token_separators?: string[];
  symbols_to_index?: string[];
  default_sorting_field?: string;
  enable_nested_fields?: boolean;
};

type CollectionCreateOptions = {
  src_name?: string;
};

type CollectionSchema =
  & Required<CollectionCreateSchema>
  & {
    created_at: number;
    num_documents: number;
    num_memory_shards: number;
  };

// @TODO original has `type` as required, maybe raise issue?
type CollectionUpdateFieldSchema =
  & Omit<CollectionFieldSchema, "type">
  & Partial<Pick<CollectionFieldSchema, "type">>
  & {
    drop?: true;
  };

type CollectionUpdateSchema =
  & Omit<CollectionCreateSchema, "fields">
  & { fields?: CollectionUpdateFieldSchema[] };

export type {
  CollectionCreateOptions,
  CollectionCreateSchema,
  CollectionSchema,
  CollectionUpdateSchema,
  FieldType,
};
