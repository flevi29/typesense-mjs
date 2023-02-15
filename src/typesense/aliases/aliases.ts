import { ALIASES } from "../core/path_segments.ts";
import { type Config } from "../core/config.ts";
import { type ApiCall } from "../core/api_call.ts";
import {
  CollectionAliasesResponseSchema,
  CollectionAliasSchema,
} from "./model.ts";

export class Aliases {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config) {
    this.#URL = () => `${configuration.baseURL}/${ALIASES}`;
    this.#apiCall = configuration.apiCall;
  }

  async upsert(collectionAliasSchema: CollectionAliasSchema) {
    const { name, ...schema } = collectionAliasSchema;
    const response = await this.#apiCall.request(`${this.#URL()}/${name}`, {
      method: "PUT",
      body: JSON.stringify(schema),
    });
    return <Promise<CollectionAliasSchema>> response.json();
  }

  async retrieveAll() {
    const response = await this.#apiCall.request(this.#URL());
    return <Promise<CollectionAliasesResponseSchema>> response.json();
  }

  async retrieve(name: string) {
    const response = await this.#apiCall.request(`${this.#URL()}/${name}`);
    return <Promise<CollectionAliasSchema>> response.json();
  }

  async delete(name: string) {
    const response = await this.#apiCall.request(`${this.#URL()}/${name}`, {
      method: "DELETE",
    });
    return <Promise<CollectionAliasSchema>> response.json();
  }
}
