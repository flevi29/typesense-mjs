type SearchParamsRecord = Record<string, string | number | boolean>;

function recordToUrlSearchParams(record: SearchParamsRecord) {
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(record)) {
    switch (typeof val) {
      case "string":
        searchParams.set(key, val);
        continue;
      case "number":
        searchParams.set(key, val.toString(10));
        continue;
      case "boolean":
        searchParams.set(key, val ? "true" : "false");
        continue;
      default:
        throw new Error("unhandled type: " + typeof val);
    }
  }
  return searchParams;
}

export function getURLWithSearchParams(
  url: string,
  record?: SearchParamsRecord,
) {
  if (record === undefined) {
    return url;
  }
  const searchParams = recordToUrlSearchParams(record);
  return url + "?" + searchParams.toString();
}
