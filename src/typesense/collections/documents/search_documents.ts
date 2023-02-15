import { COLLECTIONS, DOCUMENTS, SEARCH } from "../../core/path_segments.ts";
import { getURLWithSearchParams } from "../../core/url_search_params.ts";
import { type Config } from "../../core/config.ts";
import { type ApiCall } from "../../core/api_call.ts";
import { SearchParams, SearchResponse, TypesenseDocument } from "./model.ts";

export class SearchDocuments<
  TDocument extends TypesenseDocument = TypesenseDocument,
> {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config, collection: string) {
    const path = `${COLLECTIONS}/${collection}/${DOCUMENTS}/${SEARCH}`;
    this.#URL = () => `${configuration.baseURL}/${path}`;
    this.#apiCall = configuration.apiCall;
  }

  async search(
    searchParameters: SearchParams,
    options?: { signal: AbortSignal },
  ) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(this.#URL(), searchParameters),
      { signal: options?.signal },
    );
    return <Promise<SearchResponse<TDocument>>> response.json();
  }
}
