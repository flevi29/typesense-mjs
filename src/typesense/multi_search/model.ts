import {
  SearchParams,
  SearchResponse,
  TypesenseDocument,
} from "../collections/documents/model.ts";

type MultiSearchRequestSchema = SearchParams & {
  collection?: string;
  // @TODO Find out why sending api key as parameter could be important, and if should add it
  // 'x-typesense-api-key'?: string;
};

type MultiSearchRequestsSchema = {
  searches: MultiSearchRequestSchema[];
};

type MultiSearchResponse<TDocument extends TypesenseDocument> = {
  results: SearchResponse<TDocument>[];
};

export type {
  MultiSearchRequestSchema,
  MultiSearchRequestsSchema,
  MultiSearchResponse,
};
