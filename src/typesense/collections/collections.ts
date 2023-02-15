import { COLLECTIONS } from "../core/path_segments.ts";
import { getURLWithSearchParams } from "../core/url_search_params.ts";
import { type Config } from "../core/config.ts";
import { type ApiCall } from "../core/api_call.ts";
import {
  CollectionCreateOptions,
  CollectionCreateSchema,
  CollectionSchema,
  CollectionUpdateSchema,
} from "./model.ts";

export class Collections {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config) {
    this.#URL = () => `${configuration.baseURL}/${COLLECTIONS}`;
    this.#apiCall = configuration.apiCall;
  }

  async create<TOptions extends CollectionCreateOptions>(
    createSchema: TOptions["src_name"] extends string
      ? Pick<CollectionCreateSchema, "name">
      : CollectionCreateSchema,
    options?: TOptions,
  ) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(this.#URL(), options),
      { method: "POST", body: JSON.stringify(createSchema) },
    );
    return <Promise<CollectionSchema>> response.json();
  }

  async retrieveAll() {
    const response = await this.#apiCall.request(
      this.#URL(),
    );
    return <Promise<CollectionSchema[]>> response.json();
  }

  async retrieve(collection: string) {
    const response = await this.#apiCall.request(
      `${this.#URL()}/${collection}`,
    );
    return <Promise<CollectionSchema>> response.json();
  }

  async update(updateSchema: CollectionUpdateSchema) {
    const { name, ...schema } = updateSchema;
    const response = await this.#apiCall.request(
      `${this.#URL()}/${name}`,
      { method: "PATCH", body: JSON.stringify(schema) },
    );
    return <Promise<CollectionSchema>> response.json();
  }

  async delete(collection: string) {
    const response = await this.#apiCall.request(
      `${this.#URL()}/${collection}`,
      { method: "DELETE" },
    );
    return <Promise<CollectionSchema>> response.json();
  }
}
