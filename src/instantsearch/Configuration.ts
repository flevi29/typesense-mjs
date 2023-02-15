import { SearchClientOptions } from "./model.ts";

export class Configuration {
  readonly additionalSearchParameters?:
    SearchClientOptions["additionalSearchParameters"];
  readonly geoLocationField: string;
  readonly collectionSpecificSearchParameters:
    SearchClientOptions["collectionSpecificSearchParameters"];

  constructor(options: SearchClientOptions) {
    // @TODO should `structuredClone`?
    // @TODO There should be a default local cache of 2 minutes
    this.additionalSearchParameters = options.additionalSearchParameters;

    if (
      this.additionalSearchParameters !== undefined &&
      this.additionalSearchParameters.highlight_full_fields === undefined &&
      this.additionalSearchParameters.query_by !== undefined
    ) {
      this.additionalSearchParameters.highlight_full_fields =
        this.additionalSearchParameters.query_by;
    }

    this.geoLocationField = options.geoLocationField ?? "_geoloc";

    this.collectionSpecificSearchParameters =
      options.collectionSpecificSearchParameters;

    if (this.collectionSpecificSearchParameters !== undefined) {
      for (
        const params of Object.values(this.collectionSpecificSearchParameters)
      ) {
        if (params.highlight_full_fields === undefined) {
          const newValue =
            options.additionalSearchParameters?.highlight_full_fields ??
              params.query_by;
          if (newValue !== undefined) {
            params.highlight_full_fields = newValue;
          }
        }
      }
    }
  }
}
