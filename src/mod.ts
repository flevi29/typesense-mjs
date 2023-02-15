// @TODO Export aliases, cluster op, synonyms, overrides
export { Config } from "./typesense/core/config.ts";

export { Collections } from "./typesense/collections/collections.ts";
export type {
  CollectionCreateOptions,
  CollectionCreateSchema,
  CollectionSchema,
  CollectionUpdateSchema,
} from "./typesense/collections/model.ts";

export { Documents } from "./typesense/collections/documents/documents.ts";
export { SearchDocuments } from "./typesense/collections/documents/search_documents.ts";
export type {
  DeleteOptions,
  DeleteResponse,
  DocumentImportOptions,
  DocumentsExportOptions,
  DocumentWriteOptions,
  ImportResponse,
  ImportResponseFail,
  ImportResponseSuccess,
  SearchParams,
  SearchResponse,
  UpdatableDocument,
} from "./typesense/collections/documents/model.ts";

export { MultiSearch } from "./typesense/multi_search/multi_search.ts";
export type {
  MultiSearchRequestSchema,
  MultiSearchRequestsSchema,
  MultiSearchResponse,
} from "./typesense/multi_search/model.ts";

export { Keys } from "./typesense/keys/keys.ts";
export type {
  KeyCreateSchema,
  KeyDeleteSchema,
  KeySchema,
  KeysRetrieveSchema,
} from "./typesense/keys/model.ts";

export {
  type ErrorCode,
  TypesenseError,
} from "./typesense/core/typesense_error.ts";

export {
  generateTypesFromCollection,
  generateTypesFromSchema,
} from "./type_generator/generator.ts";
