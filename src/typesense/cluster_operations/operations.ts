import { CLUSTER } from "../core/path_segments.ts";
import { getURLWithSearchParams } from "../core/url_search_params.ts";
import { type ApiCall } from "../core/api_call.ts";
import { type Config } from "../core/config.ts";
import {
  ConfigOptions,
  DebugResponseSchema,
  MetricsResponse,
  OperationName,
  OperationSchema,
  QueryRecord,
  StatsResponse,
  SuccessResponse,
} from "./model.ts";

export class Operations {
  readonly #operationsURL: () => string;
  readonly #configURL: () => string;
  readonly #metricsURL: () => string;
  readonly #statsURL: () => string;
  readonly #healthURL: () => string;
  readonly #debugURL: () => string;
  readonly #apiCall: ApiCall;

  constructor(configuration: Config) {
    this.#operationsURL = () =>
      `${configuration.baseURL}/${CLUSTER.operations}`;
    this.#configURL = () => `${configuration.baseURL}/${CLUSTER.config}`;
    this.#metricsURL = () => `${configuration.baseURL}/${CLUSTER.metrics}`;
    this.#statsURL = () => `${configuration.baseURL}/${CLUSTER.stats}`;
    this.#healthURL = () => `${configuration.baseURL}/${CLUSTER.health}`;
    this.#debugURL = () => `${configuration.baseURL}/${CLUSTER.debug}`;
    this.#apiCall = configuration.apiCall;
  }

  async operation<TOpName extends OperationName>(
    operationName: TOpName,
    queryParameters: QueryRecord<TOpName>,
  ) {
    const response = await this.#apiCall.request(
      getURLWithSearchParams(
        `${this.#operationsURL()}/${operationName}`,
        queryParameters,
      ),
      { method: "POST" },
    );
    return <Promise<OperationSchema<TOpName>>> response.json();
  }

  async config(config?: ConfigOptions) {
    const response = await this.#apiCall.request(this.#configURL(), {
      method: "POST",
      body: JSON.stringify(config),
    });
    return <Promise<SuccessResponse>> response.json();
  }

  async metrics() {
    const response = await this.#apiCall.request(this.#metricsURL());
    return <Promise<MetricsResponse>> response.json();
  }

  async stats() {
    const response = await this.#apiCall.request(this.#statsURL());
    return <Promise<StatsResponse>> response.json();
  }

  async health() {
    const response = await this.#apiCall.request(this.#healthURL());
    return <Promise<SuccessResponse>> response.json();
  }

  async debug() {
    const response = await this.#apiCall.request(this.#debugURL());
    return <Promise<DebugResponseSchema>> response.json();
  }
}
