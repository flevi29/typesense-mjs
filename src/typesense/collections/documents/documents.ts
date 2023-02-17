import {
  COLLECTIONS,
  DOCUMENTS,
  EXPORT,
  IMPORT,
} from "../../core/path_segments.ts";
import { getURLWithSearchParams } from "../../core/url_search_params.ts";
import { type Config } from "../../core/config.ts";
import { type ApiCall } from "../../core/api_call.ts";
import {
  CreatableDocument,
  DeleteOptions,
  DeleteResponse,
  DocumentImportOptions,
  DocumentsExportOptions,
  DocumentWriteOptions,
  ImportResponse,
  TypesenseDocument,
  UpdatableDocument,
} from "./model.ts";

type ParametersFromSecond<TFn extends (...args: never[]) => unknown> =
  TFn extends
    (...args: [param1: never, ...restOfParams: infer RestOfParams]) => unknown
    ? RestOfParams
    : never;

export class Documents<
  TDocument extends TypesenseDocument = TypesenseDocument,
> {
  readonly #URL: () => string;
  readonly #exportURL: () => string;
  readonly #importURL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config, collection: string) {
    const path = `${COLLECTIONS}/${collection}/${DOCUMENTS}`;
    this.#URL = () => `${configuration.baseURL}/${path}`;
    this.#exportURL = () => `${this.#URL()}/${EXPORT}`;
    this.#importURL = () => `${this.#URL()}/${IMPORT}`;
    this.#apiCall = configuration.apiCall;
  }

  async indexDocument<TOptions extends DocumentWriteOptions>(
    document: TOptions["action"] extends "update" | "emplace"
      ? UpdatableDocument<TDocument>
      : CreatableDocument<TDocument>,
    options?: TOptions,
  ) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(this.#URL(), options),
      { method: "POST", body: JSON.stringify(document) },
    );
    return <Promise<TDocument>> response.json();
  }

  async deleteDocuments(options: DeleteOptions) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(this.#URL(), options),
      { method: "DELETE" },
    );
    return <Promise<DeleteResponse>> response.json();
  }

  async export(
    options?: { parameters?: DocumentsExportOptions; signal?: AbortSignal },
  ) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(this.#exportURL(), options?.parameters),
      { signal: options?.signal },
    );
    const { body } = response;
    if (body === null) {
      throw new Error("expected response body to be non-null");
    }
    return body;
  }

  async import(
    JSONLines: string,
    options?: DocumentImportOptions,
  ) {
    const response = await this.#apiCall
      .request(
        getURLWithSearchParams(this.#importURL(), options),
        {
          method: "POST",
          body: JSONLines,
          headers: { "Content-Type": "text/plain" },
        },
      );
    return response.text();
  }

  async importDocuments<
    TArgs extends ParametersFromSecond<Documents["import"]>,
  >(
    documents:
      (TArgs[0] extends DocumentWriteOptions
        ? TArgs[0]["action"] extends "update" | "emplace"
          ? UpdatableDocument<TDocument>
        : CreatableDocument<TDocument>
        : never)[],
    ...args: TArgs
  ) {
    if (documents.length === 0) {
      throw new Error("documents array argument must contain elements");
    }
    const JSONLines = documents
      .map((document) => JSON.stringify(document))
      .join("\n");
    const JSONLinesResponse = await this.import(JSONLines, ...args);
    const importResponses: ImportResponse<TDocument>[] = JSONLinesResponse
      .split("\n").map(
        (json) => JSON.parse(json),
      );
    return importResponses;
  }

  async retrieve(id: string) {
    const response = await this.#apiCall.request(
      `${this.#URL()}/${id}`,
    );
    return <Promise<TDocument>> response.json();
  }

  // @TODO In typesense-js id is also being sent as a query parameter for some reason in idOrQuery, raise issue?
  async delete(id: string) {
    const response = await this.#apiCall.request(
      `${this.#URL()}/${id}`,
      { method: "DELETE" },
    );
    return <Promise<TDocument>> response.json();
  }

  async update(
    document: UpdatableDocument<TDocument>,
    options?: DocumentWriteOptions,
  ) {
    // @TODO Questionable options, is typesense-js wrong?
    const { id, ...restOfDoc } = document;
    const url = getURLWithSearchParams(`${this.#URL()}/${id}`, options);
    const response = await this.#apiCall.request(url, {
      method: "PATCH",
      body: JSON.stringify(restOfDoc),
    });
    return <Promise<TDocument>> response.json();
  }
}
