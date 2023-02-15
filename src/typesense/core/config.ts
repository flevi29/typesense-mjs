import { ApiCall } from "./api_call.ts";

export class Config {
  #baseURL: string;
  readonly #apiCall: ApiCall;

  constructor(
    baseURL: URL | string,
    ...args: ConstructorParameters<typeof ApiCall>
  ) {
    if (typeof baseURL === "string") {
      // check if string is a valid URL
      new URL(baseURL);
      this.#baseURL = baseURL;
    } else {
      this.#baseURL = baseURL.href;
    }
    this.#apiCall = new ApiCall(...args);
  }

  get baseURL() {
    return this.#baseURL;
  }

  set baseURL(baseURL: URL | string) {
    if (typeof baseURL === "string") {
      // check if string is a valid URL
      new URL(baseURL);
      this.#baseURL = baseURL;
    } else {
      this.#baseURL = baseURL.href;
    }
  }

  get apiCall() {
    return this.#apiCall;
  }
}
