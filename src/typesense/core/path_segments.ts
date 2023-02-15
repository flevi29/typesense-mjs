const ALIASES = "aliases";
const COLLECTIONS = "collections";
const DOCUMENTS = "documents";
const SEARCH = "search";
const IMPORT = "import";
const EXPORT = "export";
const KEYS = "keys";
const OVERRIDES = "overrides";
const SYNONYMS = "synonyms";
const CLUSTER = {
  operations: "operations",
  config: "config",
  metrics: "metrics.json",
  stats: "stats.json",
  health: "health",
  debug: "debug",
} as const;

export {
  ALIASES,
  CLUSTER,
  COLLECTIONS,
  DOCUMENTS,
  EXPORT,
  IMPORT,
  KEYS,
  OVERRIDES,
  SEARCH,
  SYNONYMS,
};
