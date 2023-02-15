import { SearchParams } from "../typesense/collections/documents/model.ts";

type BaseSearchParameters = Omit<SearchParams, "q" | "query_by" | "filter_by">;

type SearchParameters<TOptional extends boolean> =
  & BaseSearchParameters
  & (TOptional extends false ? { query_by: string } : { query_by?: string });

type CollectionSearchParameters<TOptional extends boolean> = {
  [collection: string]: SearchParameters<TOptional>;
};

type BaseOptions = {
  geoLocationField?: string;
};

type AdditionalSearchParameters<TOptional extends boolean> =
  & BaseOptions
  & (TOptional extends false
    ? { additionalSearchParameters: SearchParameters<false> }
    : { additionalSearchParameters?: SearchParameters<true> });

type CollectionSpecificSearchParameters<TOptional extends boolean> =
  & BaseOptions
  & (TOptional extends false
    ? { collectionSpecificSearchParameters: CollectionSearchParameters<false> }
    : {
      collectionSpecificSearchParameters?: CollectionSearchParameters<true>;
    });

type OptionsWithQueryByInAdditionalSearchParameters =
  & AdditionalSearchParameters<false>
  & CollectionSpecificSearchParameters<true>;

type OptionsWithQueryByInCollectionSpecificSearchParameters =
  & AdditionalSearchParameters<true>
  & CollectionSpecificSearchParameters<false>;

type SearchClientOptions =
  | OptionsWithQueryByInCollectionSpecificSearchParameters
  | OptionsWithQueryByInAdditionalSearchParameters;

export type { SearchClientOptions };
