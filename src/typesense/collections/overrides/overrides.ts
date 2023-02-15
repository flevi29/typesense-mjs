import { COLLECTIONS, OVERRIDES } from "../../core/path_segments.ts";
import { type Config } from "../../core/config.ts";
import { type ApiCall } from "../../core/api_call.ts";
import {
  OverrideDeleteSchema,
  OverrideSchema,
  OverridesRetrieveSchema,
} from "./model.ts";

export class Overrides {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config, collection: string) {
    const path = `${COLLECTIONS}/${collection}/${OVERRIDES}`;
    this.#URL = () => `${configuration.baseURL}/${path}`;
    this.#apiCall = configuration.apiCall;
  }

  async upsert(overrideSchema: OverrideSchema) {
    const { id, ...schema } = overrideSchema;
    const response = await this.#apiCall.request(
      `${this.#URL()}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(schema),
      },
    );
    return <Promise<OverrideSchema>> response.json();
  }

  async retrieveAll() {
    const response = await this.#apiCall.request(this.#URL());
    return <Promise<OverridesRetrieveSchema>> response.json();
  }

  async retrieve(id: string) {
    const response = await this.#apiCall.request(`${this.#URL()}/${id}`);
    return <Promise<OverrideSchema>> response.json();
  }

  async delete(id: string) {
    const response = await this.#apiCall.request(
      `${this.#URL()}/${id}`,
      { method: "DELETE" },
    );
    return <Promise<OverrideDeleteSchema>> response.json();
  }
}
