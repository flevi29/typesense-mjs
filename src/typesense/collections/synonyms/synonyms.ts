import {
  SynonymDeleteSchema,
  SynonymSchema,
  SynonymsRetrieveSchema,
} from "./model.ts";
import { ApiCall } from "../../core/api_call.ts";
import { Config } from "../../core/config.ts";
import { COLLECTIONS, SYNONYMS } from "../../core/path_segments.ts";

export class Synonyms {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config, collection: string) {
    const path = `${COLLECTIONS}/${collection}/${SYNONYMS}`;
    this.#URL = () => `${configuration.baseURL}/${path}`;
    this.#apiCall = configuration.apiCall;
  }

  async upsert(synonymSchema: SynonymSchema) {
    const { id, ...schema } = synonymSchema;
    const response = await this.#apiCall.request(`${this.#URL()}/${id}`, {
      method: "PUT",
      body: JSON.stringify(schema),
    });
    return <Promise<SynonymSchema>> response.json();
  }

  async retrieveAll() {
    const response = await this.#apiCall.request(this.#URL());
    return <Promise<SynonymsRetrieveSchema>> response.json();
  }

  async retrieve(id: string) {
    const response = await this.#apiCall.request(`${this.#URL()}/${id}`);
    return <Promise<SynonymSchema>> response.json();
  }

  async delete(id: string) {
    const response = await this.#apiCall.request(`${this.#URL()}/${id}`, {
      method: "DELETE",
    });
    return <Promise<SynonymDeleteSchema>> response.json();
  }
}
