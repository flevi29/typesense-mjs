import { getURLWithSearchParams } from "../core/url_search_params.ts";
import { type Config } from "../core/config.ts";
import { type ApiCall } from "../core/api_call.ts";
import { TypesenseDocument } from "../collections/documents/model.ts";
import {
  MultiSearchRequestSchema,
  MultiSearchRequestsSchema,
  MultiSearchResponse,
} from "./model.ts";

export class MultiSearch<
  TDocument extends TypesenseDocument = TypesenseDocument,
> {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;
  readonly #header?: Record<string, string>;

  constructor(
    configuration: Config,
    useTextContentType: boolean = false,
  ) {
    this.#URL = () => `${configuration.baseURL}/multi_search`;
    this.#apiCall = configuration.apiCall;
    if (useTextContentType) {
      this.#header = { "Content-Type": "text/plain" };
    }
  }

  async request(
    searchRequests: MultiSearchRequestsSchema,
    commonParams?: Partial<MultiSearchRequestSchema>,
  ) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(this.#URL(), commonParams),
      {
        method: "POST",
        body: JSON.stringify(searchRequests),
        headers: this.#header,
      },
    );
    return <Promise<MultiSearchResponse<TDocument>>> response.json();
  }
}
