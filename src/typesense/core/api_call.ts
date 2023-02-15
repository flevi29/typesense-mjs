import { TypesenseError } from "./typesense_error.ts";

// https://github.com/typesense/typesense-js/blob/master/src/Typesense/ApiCall.ts

interface ApiRequestInit extends RequestInit {
  headers?: Record<string, string>;
}

// @TODO `useServerSideSearchCache` https://typesense.org/docs/0.23.1/api/search.html#caching-parameters maybe?
//       Note that I only saw it on multi search yet

export class ApiCall {
  readonly #apiKey: string;
  readonly #retryInterval: number;
  readonly #numRetriesPerRequest: number;
  readonly #baseHeaders: Record<string, string>;
  readonly #debugLogRetries: boolean;
  readonly #healthCallback: ((isHealthy: boolean) => void) | null;

  constructor(
    apiKey: string,
    options?: {
      numRetriesPerRequest?: number;
      retryInterval?: number;
      additionalUserHeaders?: Record<string, string>;
      debugLogRetries?: boolean;
      healthCallback?: (isHealthy: boolean) => void;
    },
  ) {
    this.#apiKey = apiKey;
    this.#numRetriesPerRequest = options?.numRetriesPerRequest ?? 3;
    this.#retryInterval = options?.retryInterval ?? 1000;
    this.#baseHeaders = {
      ...options?.additionalUserHeaders,
      "X-TYPESENSE-API-KEY": this.#apiKey,
      "Content-Type": "application/json",
    };
    this.#debugLogRetries = options?.debugLogRetries ?? false;
    this.#healthCallback = options?.healthCallback ?? null;
  }

  #safeHealthCallback(cb: (isHealthy: boolean) => void, isHealthy: boolean) {
    try {
      cb(isHealthy);
    } catch (error) {
      console.error(error);
      console.warn("errors should be handled in the health callback");
    }
  }

  async #checkResponse(response: Response) {
    const { ok, status, statusText } = response;
    if (this.#healthCallback !== null && status > 0 && status < 500) {
      this.#safeHealthCallback(this.#healthCallback, true);
    }
    if (!ok) {
      const messageFromServer = await response.text();
      const errorMessage =
        `request to ${response.url} failed with HTTP status ${status} ${statusText}${
          messageFromServer.trim() !== ""
            ? ` | response from server: ${messageFromServer}`
            : ""
        }`;
      throw new TypesenseError(errorMessage, response);
    }
  }

  #getRequestInitWithBaseHeaders(requestInit?: ApiRequestInit): ApiRequestInit {
    if (requestInit === undefined) {
      return { headers: this.#baseHeaders };
    }
    if (requestInit.headers === undefined) {
      requestInit.headers = this.#baseHeaders;
      return requestInit;
    }
    for (const [key, value] of Object.entries(this.#baseHeaders)) {
      if (requestInit.headers[key] === undefined) {
        requestInit.headers[key] = value;
      }
    }
    return requestInit;
  }

  async #request(
    url: string,
    requestOptions?: ApiRequestInit,
    retries = this.#numRetriesPerRequest,
  ): Promise<Response> {
    try {
      const response = await fetch(
        url,
        this.#getRequestInitWithBaseHeaders(requestOptions),
      );
      await this.#checkResponse(response);
      return response;
    } catch (error: unknown) {
      if (
        retries < 1 || !(error instanceof TypesenseError) ||
        error.code !== "SERVER_ERROR"
      ) {
        throw error;
      }
      if (this.#healthCallback !== null) {
        this.#safeHealthCallback(this.#healthCallback, false);
      }
      if (this.#debugLogRetries) {
        console.debug(error);
      }
      if (this.#retryInterval > 0) {
        if (this.#debugLogRetries) {
          console.debug(
            `retrying request in ${this.#retryInterval}ms"`,
          );
        }
        await new Promise((resolve) =>
          setTimeout(resolve, this.#retryInterval)
        );
      }
      return this.#request(url, requestOptions, retries - 1);
    }
  }

  request(url: string, requestOptions?: ApiRequestInit) {
    return this.#request(
      url,
      requestOptions,
    );
  }
}
