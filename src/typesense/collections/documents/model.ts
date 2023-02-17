// deno-lint-ignore no-explicit-any
type TypesenseDocument = { id: string; [name: string]: any };

type CreatableDocument<TDocument extends TypesenseDocument> = {
  [name in keyof TDocument]: undefined extends
    Extract<TDocument[name], undefined> ? TDocument[name] | null
    : TDocument[name];
};

type UpdatableDocument<TDocument extends TypesenseDocument> =
  & Pick<TDocument, "id">
  & {
    [name in keyof Omit<TDocument, "id">]?: undefined extends
      Extract<TDocument[name], undefined> ? TDocument[name] | null
      : TDocument[name];
  };

type DeleteOptions = {
  filter_by: string;
  batch_size?: number;
};

type DeleteResponse = {
  num_deleted: number;
};

type ImportResponseSuccess = {
  success: true;
};

type ImportResponseFail<
  TDocument extends TypesenseDocument = TypesenseDocument,
> = {
  success: false;
  error: string;
  document: TDocument;
  code: number;
};

type ImportResponse<TDocument extends TypesenseDocument> =
  | ImportResponseSuccess
  | ImportResponseFail<TDocument>;

type SearchParams = {
  // From https://typesense.org/docs/latest/api/documents.html#arguments
  q: string;
  query_by: string;
  query_by_weights?: string;
  prefix?: string | boolean; // default: true
  filter_by?: string;
  sort_by?: string; // default: text match desc
  facet_by?: string;
  max_facet_values?: number;
  facet_query?: string;
  facet_query_num_typos?: number;
  page?: number; // default: 1
  per_page?: number; // default: 10, max 250
  group_by?: string;
  group_limit?: number; // default:
  include_fields?: string;
  exclude_fields?: string;
  highlight_fields?: string; // default: all queried fields
  highlight_full_fields?: string; // default: all fields
  highlight_affix_num_tokens?: number; // default: 4
  highlight_start_tag?: string; // default: <mark>
  highlight_end_tag?: string; // default: </mark>
  snippet_threshold?: number; // default: 30
  num_typos?: string | number; // default: 2
  min_len_1typo?: number;
  min_len_2typo?: number;
  split_join_tokens?: string;
  exhaustive_search?: boolean;
  drop_tokens_threshold?: number; // default: 10
  typo_tokens_threshold?: number; // default: 100
  pinned_hits?: string;
  hidden_hits?: string;
  limit_hits?: number; // default: no limit
  pre_segmented_query?: boolean;
  enable_overrides?: boolean;
  prioritize_exact_match?: boolean; // default: true
  prioritize_token_position?: boolean;
  search_cutoff_ms?: number;
  use_cache?: boolean;
  max_candidates?: number;
  infix?: string;
  preset?: string;
  text_match_type?: string;
};

// @TODO What the heck is all of this?
type SearchResponseHighlightObject = {
  matched_tokens?: string[];
  snippet?: string;
  value?: string;
};

type SearchResponseHighlight<T> = T extends string | number
  ? SearchResponseHighlightObject
  : {
    [TAttribute in keyof T]?: SearchResponseHighlight<T[TAttribute]>;
  };

type SearchResponseHit<TDocument extends TypesenseDocument> = {
  highlights?: [
    {
      field: keyof TDocument;
      snippet?: string;
      value?: string;
      snippets?: string[];
      indices?: number[];
      matched_tokens: string[][] | string[];
    },
  ];
  // @TODO Dafuq is going on here?
  highlight: SearchResponseHighlight<TDocument>;
  document: TDocument;
  text_match: number;
  text_match_info?: {
    best_field_score: string; // To prevent scores from being truncated by JSON spec
    best_field_weight: number;
    fields_matched: number;
    score: string; // To prevent scores from being truncated by JSON spec
    tokens_matched: number;
  };
};

type SearchResponseFacetCountSchema<TDocument extends TypesenseDocument> = {
  counts: {
    count: number;
    highlighted: string;
    value: string;
  }[];
  field_name: keyof TDocument;
  stats: {
    avg?: number;
    max?: number;
    min?: number;
    sum?: number;
  };
};

// TODO: we could infer whether this is a grouped response by adding the search params as a generic
interface SearchResponse<TDocument extends TypesenseDocument> {
  facet_counts?: SearchResponseFacetCountSchema<TDocument>[];
  found: number;
  out_of: number;
  page: number;
  request_params: SearchParams;
  search_time_ms: number;
  hits?: SearchResponseHit<TDocument>[];
  grouped_hits?: {
    group_key: string[];
    hits: SearchResponseHit<TDocument>[];
  }[];
}

type DocumentWriteOptions = {
  dirty_values?: "coerce_or_reject" | "coerce_or_drop" | "drop" | "reject";
  action?: "create" | "update" | "upsert" | "emplace";
};

type DocumentImportOptions = DocumentWriteOptions & {
  batch_size?: number;
  return_doc?: boolean;
  return_id?: boolean;
};

type DocumentsExportOptions = {
  filter_by?: string;
  include_fields?: string;
  exclude_fields?: string;
};

export type {
  CreatableDocument,
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
  SearchResponseFacetCountSchema,
  SearchResponseHighlight,
  SearchResponseHit,
  TypesenseDocument,
  UpdatableDocument,
};
