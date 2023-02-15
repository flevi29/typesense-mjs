import { KEYS } from "../core/path_segments.ts";
import { type Config } from "../core/config.ts";
import { type ApiCall } from "../core/api_call.ts";
import {
  KeyCreateSchema,
  KeyDeleteSchema,
  KeySchema,
  KeysRetrieveSchema,
} from "./model.ts";

export class Keys {
  readonly #URL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config) {
    this.#URL = () => `${configuration.baseURL}/${KEYS}`;
    this.#apiCall = configuration.apiCall;
  }

  async create(params: KeyCreateSchema) {
    const response = await this.#apiCall.request(this.#URL(), {
      method: "POST",
      body: JSON.stringify(params),
    });
    return <Promise<KeySchema>> response.json();
  }

  async retrieveAll() {
    const response = await this.#apiCall.request(this.#URL());
    return <Promise<KeysRetrieveSchema>> response.json();
  }

  async retrieve(id: number) {
    const response = await this.#apiCall.request(`${this.#URL()}/${id}`);
    return <Promise<KeySchema>> response.json();
  }

  async delete(id: number) {
    const response = await this.#apiCall.request(`${this.#URL()}/${id}`, {
      method: "DELETE",
    });
    return <Promise<KeyDeleteSchema>> response.json();
  }
}
