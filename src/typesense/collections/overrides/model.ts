type OverrideRuleQuerySchema = {
  query: string;
  match: "exact" | "contains";
};

type OverrideRuleFilterSchema = {
  filter_by: string;
};

type OverrideSchema = {
  id: string;
  rule: OverrideRuleQuerySchema | OverrideRuleFilterSchema;
  filter_by?: string;
  sort_by?: string;
  remove_matched_tokens?: boolean;
  replace_query?: string;
  includes?: { id: string; position: number }[];
  excludes?: { id: string }[];
  filter_curated_hits?: boolean;
  effective_from_ts?: number;
  effective_to_ts?: number;
  stop_processing?: boolean;
};

type OverridesRetrieveSchema = { overrides: OverrideSchema[] };

type OverrideDeleteSchema = { id: string };

export type {
  OverrideDeleteSchema,
  OverrideRuleFilterSchema,
  OverrideRuleQuerySchema,
  OverrideSchema,
  OverridesRetrieveSchema,
};
