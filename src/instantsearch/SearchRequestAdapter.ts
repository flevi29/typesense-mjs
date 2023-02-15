import { SearchClient } from "npm:algoliasearch-helper@^3.11.3/types/algoliasearch.js";
import { type MultiSearch } from "../typesense/multi_search/multi_search.ts";

// https://github.com/microsoft/TypeScript/issues/17002 amazing, open since Jul 7, 2017
// Almost a 6 years old issue at the time of writing this! Maybe by 2027 fixed?
function isReadonlyArray(
  arg: ReadonlyArray<any> | any,
): arg is ReadonlyArray<any> {
  return Array.isArray(arg);
}

export class SearchRequestAdapter {
  static readonly INDEX_NAME_MATCHING_REGEX = new RegExp(
    "^(.+?)(?=(/sort/(.*))|$)",
  );
  static readonly FILTER_STRING_MATCHING_REGEX = new RegExp(
    "(.*)((?!:).):(?!:)(.*)",
  );

  readonly #queries: Parameters<SearchClient["search"]>[0];
  readonly #multiSearch: MultiSearch;

  constructor(
    queries: Parameters<SearchClient["search"]>[0],
    multiSearch: MultiSearch,
    configuration,
  ) {
    this.#queries = queries;
    this.#multiSearch = multiSearch;
    this.configuration = configuration;
    this.additionalSearchParameters = configuration.additionalSearchParameters;
    this.collectionSpecificSearchParameters =
      configuration.collectionSpecificSearchParameters;
  }

  _adaptFacetFilters(
    facetFilters: NonNullable<
      Parameters<SearchClient["search"]>[0][number]["params"]
    >["facetFilters"],
  ) {
    let adaptedResult = "";

    if (!facetFilters) {
      return adaptedResult;
    }

    /**
     * Need to transform:
     *  facetFilters = [["field1:value1", "field1:value2"], "field2:value3", "field2:value4"]
     *
     * Into this:
     *  field1:=[value1,value2] && field2:=value3 && field2:=value4
     *
     * Steps:
     *  - For each item in facetFilters
     *    - If item is array
     *      - OR values together.
     *      - Warn if field names are not the same
     *    - If item is string, convert to facet:=value format
     *  - Join strings by &&
     */

    if (typeof facetFilters === "string") {
      // @TODO
      throw new Error("unimplemented");
    }

    const transformedTypesenseFilters = facetFilters.map((item) => {
      if (isReadonlyArray(item)) {
        // Need to transform:
        // facetFilters = ["field1:value1", "field1:value2", "facetN:valueN"]
        //
        // Into this:
        // intermediateFacetFilters = {
        //     "field1": ["value1", "value2"],
        //     "fieldN": ["valueN"]
        // }

        const intermediateFacetFilters: Record<string, string[]> = {};
        item.forEach((facetFilter) => {
          const facetFilterMatches = facetFilter.match(
            SearchRequestAdapter.FILTER_STRING_MATCHING_REGEX,
          );
          if (facetFilterMatches === null) {
            // @TODO
            throw new Error();
          }
          // @TODO indexed unchecked access
          const fieldName = `${facetFilterMatches[1]}${facetFilterMatches[2]}`;
          const fieldValue = `${facetFilterMatches[3]}`;
          (intermediateFacetFilters[fieldName] ??= []).push(fieldValue);
        });

        if (Object.keys(intermediateFacetFilters).length > 1) {
          console.error(
            `[Typesense-Instantsearch-Adapter] Typesense does not support cross-field ORs at the moment. The adapter could not OR values between these fields: ${
              Object.keys(
                intermediateFacetFilters,
              ).join(",")
            }`,
          );
        }

        // Pick first value from intermediateFacetFilters
        const fieldName = Object.keys(intermediateFacetFilters)[0];
        const fieldValues = intermediateFacetFilters[fieldName];

        // Need to transform:
        // intermediateFacetFilters = {
        //     "field1": ["value1", "value2"],
        // }
        //
        // Into this:
        // field1:=[value1,value2]

        // Partition values into included and excluded values
        const [excludedFieldValues, includedFieldValues] = fieldValues.reduce<
          [string[], string[]]
        >(
          (result, fieldValue) => {
            if (fieldValue.startsWith("-") && !this._isNumber(fieldValue)) {
              result[0].push(fieldValue.substring(1));
            } else {
              result[1].push(fieldValue);
            }
            return result;
          },
          [[], []],
        );

        const typesenseFilterStringComponents: string[] = [];
        if (includedFieldValues.length > 0) {
          typesenseFilterStringComponents.push(
            `${fieldName}:=[${
              includedFieldValues.map((v) => this._escapeFacetValue(v)).join(
                ",",
              )
            }]`,
          );
        }
        if (excludedFieldValues.length > 0) {
          typesenseFilterStringComponents.push(
            `${fieldName}:!=[${
              excludedFieldValues.map((v) => this._escapeFacetValue(v)).join(
                ",",
              )
            }]`,
          );
        }

        return typesenseFilterStringComponents.filter((
          f,
        ) => f).join(" && ");
      } else {
        // Need to transform:
        //  fieldName:fieldValue
        // Into
        //  fieldName:=fieldValue

        // if (Array.isArray(item)) {
        //   // @TODO
        //   throw new Error("unimplemented");
        // }

        const facetFilterMatches = item.match(
          SearchRequestAdapter.FILTER_STRING_MATCHING_REGEX,
        );
        if (facetFilterMatches === null) {
          // @TODO
          throw new Error();
        }
        // @TODO indexed unchecked access
        const fieldName = `${facetFilterMatches[1]}${facetFilterMatches[2]}`;
        const fieldValue = `${facetFilterMatches[3]}`;
        let typesenseFilterString: string;
        if (fieldValue.startsWith("-") && !this._isNumber(fieldValue)) {
          typesenseFilterString = `${fieldName}:!=[${
            this._escapeFacetValue(fieldValue.substring(1))
          }]`;
        } else {
          typesenseFilterString = `${fieldName}:=[${
            this._escapeFacetValue(fieldValue)
          }]`;
        }

        return typesenseFilterString;
      }
    });

    adaptedResult = transformedTypesenseFilters.join(" && ");
    // console.log(`${JSON.stringify(facetFilters)} => ${adaptedResult}`);

    return adaptedResult;
  }

  _escapeFacetValue(value: string | boolean) {
    // @TODO Can it really be a boolean?
    // Don't escape booleans, integers or floats
    if (
      typeof value === "boolean" || value === "true" || value === "false" ||
      this._isNumber(value)
    ) {
      return value;
    }
    return `\`${value}\``;
  }

  _isNumber(value: string) {
    return !Number.isNaN(value) && !Number.isNaN(Number.parseFloat(value));
  }

  _adaptNumericFilters(
    numericFilters: NonNullable<
      Parameters<SearchClient["search"]>[0][number]["params"]
    >["numericFilters"],
  ) {
    // Need to transform this:
    // ["field1<=634", "field1>=289", "field2<=5", "field3>=3"]
    // to:
    // "field1:=[634..289] && field2:<=5 && field3:>=3"
    let adaptedResult = "";

    if (!numericFilters) {
      return adaptedResult;
    }

    // Transform to intermediate structure:
    // {
    //   field1: {
    //     "<=": 634,
    //     ">=": 289
    //   },
    //   field2: {
    //     "<=": 5
    //   },
    //   field3: {
    //     ">=": 3
    //   }
    // };

    if (typeof numericFilters === "string") {
      // @TODO
      throw new Error("unhandled");
    }

    const filtersHash: Record<string, Record<string, string>> = {};
    numericFilters.forEach((filter) => {
      if (isReadonlyArray(filter)) {
        // @TODO
        throw new Error("unhandled");
      }

      const match = filter.match(
        new RegExp("(.*?)(<=|>=|>|<|:|=)(.*)"),
      );
      if (match === null) {
        // @TODO
        throw new Error();
      }
      // @TODO maybe check if these are all defined, or perhaps some of them can be undefined?
      //       like maybe value
      const [, field, operator, value] = match;
      filtersHash[field] ||= {};
      filtersHash[field][operator] = value;
    });

    // Transform that to:
    //  "field1:=[634..289] && field2:<=5 && field3:>=3"
    const adaptedFilters: string[] = [];
    Object.keys(filtersHash).forEach((field) => {
      if (
        filtersHash[field]["<="] != null && filtersHash[field][">="] != null
      ) {
        adaptedFilters.push(
          `${field}:=[${filtersHash[field][">="]}..${
            filtersHash[field]["<="]
          }]`,
        );
      } else if (filtersHash[field]["<="] != null) {
        adaptedFilters.push(`${field}:<=${filtersHash[field]["<="]}`);
      } else if (filtersHash[field][">="] != null) {
        adaptedFilters.push(`${field}:>=${filtersHash[field][">="]}`);
      } else if (filtersHash[field]["="] != null) {
        adaptedFilters.push(`${field}:=${filtersHash[field]["="]}`);
      } else {
        console.warn(
          `[Typesense-Instantsearch-Adapter] Unsupported operator found ${
            JSON.stringify(filtersHash[field])
          }`,
        );
      }
    });

    adaptedResult = adaptedFilters.join(" && ");
    return adaptedResult;
  }

  _adaptGeoFilter(
    { insideBoundingBox, aroundRadius, aroundLatLng, insidePolygon }:
      NonNullable<Parameters<SearchClient["search"]>[0][number]["params"]>,
  ) {
    // Give this parameter first priority if it exists, since
    if (insideBoundingBox) {
      let x1, y1, x2, y2;
      if (isReadonlyArray(insideBoundingBox)) {
        [x1, y1, x2, y2] = insideBoundingBox.flat();
      } else {
        [x1, y1, x2, y2] = insideBoundingBox.split(",");
      }
      return `${this.configuration.geoLocationField}:(${x1}, ${y1}, ${x1}, ${y2}, ${x2}, ${y2}, ${x2}, ${y1})`;
    }

    if (aroundLatLng || aroundRadius) {
      if (!aroundRadius || aroundRadius === "all") {
        throw new Error(
          "[Typesense-Instantsearch-Adapter] In Typesense, geo-filtering around a lat/lng also requires a numerical radius. " +
            "So the `aroundRadius` parameter is required when `aroundLatLng` is used. " +
            "If you intend to just geo-sort around a lat/long, you want to use the sortBy InstantSearch widget (or a virtual sortBy custom widget).",
        );
      }
      // @TODO `aroundRadius` was `parseFloat` -ed, is this right?
      const adaptedAroundRadius = `${aroundRadius / 1000} km`; // aroundRadius is in meters
      return `${this.configuration.geoLocationField}:(${aroundLatLng}, ${adaptedAroundRadius})`;
    }

    if (insidePolygon) {
      const coordinates = isReadonlyArray(insidePolygon)
        ? insidePolygon.flat().join(",")
        : insidePolygon;
      return `${this.configuration.geoLocationField}:(${coordinates})`;
    }
  }

  _adaptFilters(
    instantsearchParams: NonNullable<
      Parameters<SearchClient["search"]>[0][number]["params"]
    >,
  ) {
    const adaptedFilters = [];

    // `filters` can be used with the `Configure` widget
    // However the format needs to be in the Typesense filter_by format, instead of Algolia filter format.
    if (instantsearchParams.filters) {
      adaptedFilters.push(instantsearchParams.filters);
    }
    adaptedFilters.push(
      this._adaptFacetFilters(instantsearchParams.facetFilters),
    );
    adaptedFilters.push(
      this._adaptNumericFilters(instantsearchParams.numericFilters),
    );
    adaptedFilters.push(this._adaptGeoFilter(instantsearchParams));

    return adaptedFilters.filter((filter) => filter && filter !== "").join(
      " && ",
    );
  }

  _adaptIndexName(indexName: string) {
    // @TODO Handle null?
    return indexName.match(SearchRequestAdapter.INDEX_NAME_MATCHING_REGEX)?.[1];
  }

  _adaptSortBy(indexName: string) {
    // @TODO Handle null?
    return indexName.match(SearchRequestAdapter.INDEX_NAME_MATCHING_REGEX)?.[3];
  }

  _buildSearchParameters(query: Parameters<SearchClient["search"]>[0][number]) {
    const params = query.params;
    if (params === undefined) {
      // @TODO How to handle this, should even throw here?
      throw new Error();
    }
    const indexName = query.indexName;
    const adaptedCollectionName = this._adaptIndexName(indexName);

    // Convert all common parameters to snake case
    const snakeCasedAdditionalSearchParameters = {};
    for (
      const [key, value] of Object.entries(this.additionalSearchParameters)
    ) {
      snakeCasedAdditionalSearchParameters[this._camelToSnakeCase(key)] = value;
    }

    // Override, collection specific parameters
    if (this.collectionSpecificSearchParameters[adaptedCollectionName]) {
      for (
        const [key, value] of Object.entries(
          this.collectionSpecificSearchParameters[adaptedCollectionName],
        )
      ) {
        snakeCasedAdditionalSearchParameters[this._camelToSnakeCase(key)] =
          value;
      }
    }

    const typesenseSearchParams = Object.assign(
      {},
      snakeCasedAdditionalSearchParameters,
    );

    const adaptedSortBy = this._adaptSortBy(indexName);

    Object.assign(typesenseSearchParams, {
      collection: adaptedCollectionName,
      q: params.query === "" || params.query === undefined ? "*" : params.query,
      facet_by: [params.facets].flat().join(","),
      filter_by: this._adaptFilters(params) ||
        snakeCasedAdditionalSearchParameters.filter_by,
      sort_by: adaptedSortBy || snakeCasedAdditionalSearchParameters.sort_by,
      max_facet_values: params.maxValuesPerFacet,
      page: (params.page || 0) + 1,
    });

    if (params.hitsPerPage) {
      typesenseSearchParams.per_page = params.hitsPerPage;
    }

    // @TODO Does `facetQuery` not exist anymore on params?
    if ("facetQuery" in params) {
      typesenseSearchParams.facet_query =
        `${params.facetName}:${params.facetQuery}`;
      typesenseSearchParams.per_page = 0;
    }

    // console.log(params);
    // console.log(typesenseSearchParams);

    return typesenseSearchParams;
  }

  _camelToSnakeCase(str: string) {
    return str
      .split(/(?=[A-Z])/)
      .join("_")
      .toLowerCase();
  }

  request() {
    const searches = this.#queries.map((query) =>
      this._buildSearchParameters(query)
    );

    return this.#multiSearch.request({ searches });
  }
}
