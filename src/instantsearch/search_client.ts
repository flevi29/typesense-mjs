import { SearchClient } from "npm:algoliasearch-helper@^3.11.3/types/algoliasearch.js";
import { SearchResponseAdapter } from "./SearchResponseAdapter.ts";
import { FacetSearchResponseAdapter } from "./FacetSearchResponseAdapter.ts";
import { SearchRequestAdapter } from "./SearchRequestAdapter.ts";
import { SearchClientOptions } from "./model.ts";
import { Configuration } from "./Configuration.ts";
import { MultiSearch } from "../typesense/multi_search/multi_search.ts";
import { Config } from "../typesense/core/config.ts";

export class TypesenseSearchClient {
  readonly #config: Config;
  readonly #multiSearch: MultiSearch;
  readonly #configuration: Configuration;

  constructor(
    options: SearchClientOptions,
    ...config: ConstructorParameters<typeof Config>
  ) {
    this.#config = new Config(...config);
    this.#multiSearch = new MultiSearch(this.#config);
    this.#configuration = new Configuration(options);
  }

  updateConfiguration() {
    // @TODO
  }

  #validateTypesenseResult(typesenseResult: any) {
    if (typesenseResult.error) {
      throw new Error(`${typesenseResult.code} - ${typesenseResult.error}`);
    }
    if (!typesenseResult.hits && !typesenseResult.grouped_hits) {
      throw new Error(
        `Did not find any hits. ${typesenseResult.code} - ${typesenseResult.error}`,
      );
    }
  }

  #adaptAndPerformTypesenseRequest(
    ...queries: Parameters<SearchClient["search"]>
  ) {
    const requestAdapter = new SearchRequestAdapter(
      ...queries,
      this.#multiSearch,
      this.#configuration,
    );
    return requestAdapter.request();
  }

  readonly #searchClient: SearchClient = {
    search: async (...args) => {
      try {
        const typesenseResponse = await this.#adaptAndPerformTypesenseRequest(
          ...args,
        );

        const adaptedResponses = typesenseResponse.results.map(
          (typesenseResult, index) => {
            this.#validateTypesenseResult(typesenseResult);
            const responseAdapter = new SearchResponseAdapter(
              typesenseResult,
              instantsearchRequests[index],
              this.#configuration,
            );
            return responseAdapter.adapt();
          },
        );

        return {
          results: adaptedResponses,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    searchForFacetValues: async (
      queries,
      requestOptions,
    ) => {
      let typesenseResponse;
      try {
        typesenseResponse = await this.#adaptAndPerformTypesenseRequest(
          instantsearchRequests,
        );

        const adaptedResponses = typesenseResponse.results.map(
          (typesenseResult, index) => {
            this.#validateTypesenseResult(typesenseResult);
            const responseAdapter = new FacetSearchResponseAdapter(
              typesenseResult,
              instantsearchRequests[index],
              this.#configuration,
            );
            return responseAdapter.adapt();
          },
        );

        return adaptedResponses;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    // @TODO Check if `initIndex` or `addAlgoliaAgent` can be of any use to us
  };
}
