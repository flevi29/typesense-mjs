import { Configuration } from "./Configuration.ts";
import { SearchClient as TypesenseSearchClient } from "typesense";
import { SearchRequestAdapter } from "./SearchRequestAdapter.ts";
import { SearchResponseAdapter } from "./SearchResponseAdapter.ts";
import { FacetSearchResponseAdapter } from "./FacetSearchResponseAdapter.ts";
import { SearchClientOptions } from "./model.ts";

export class TypesenseInstantsearchAdapter {
  readonly #searchClient: SearchClient;
  #configuration: Configuration;

  constructor(options: SearchClientOptions) {
    this.updateConfiguration(options);
    this.#searchClient = {
      search: (instantsearchRequests) =>
        this.searchTypesenseAndAdapt(instantsearchRequests),
      searchForFacetValues: (instantsearchRequests) =>
        this.searchTypesenseForFacetValuesAndAdapt(instantsearchRequests),
      // @TODO Read algolia code on what these do below
      // initIndex: ,
      // addAlgoliaAgent: ,
    };
  }

  async _adaptAndPerformTypesenseRequest(instantsearchRequests) {
    const requestAdapter = new SearchRequestAdapter(
      instantsearchRequests,
      this.typesenseClient,
      this.#configuration,
    );
    const typesenseResponse = await requestAdapter.request();
    return typesenseResponse;
  }

  updateConfiguration(options: SearchClientOptions) {
    this.#configuration = new Configuration(options);
    this.#configuration.validate();
    this.#typesenseClient = new TypesenseSearchClient(
      this.#configuration.server,
    );
    return true;
  }

  _validateTypesenseResult(typesenseResult) {
    if (typesenseResult.error) {
      throw new Error(`${typesenseResult.code} - ${typesenseResult.error}`);
    }
    if (!typesenseResult.hits && !typesenseResult.grouped_hits) {
      throw new Error(
        `Did not find any hits. ${typesenseResult.code} - ${typesenseResult.error}`,
      );
    }
  }
}
