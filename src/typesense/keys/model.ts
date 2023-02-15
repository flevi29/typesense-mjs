import { SearchParams } from "../collections/documents/model.ts";

type BaseVerbs = "create" | "delete" | "get" | "*";

type DocumentsVerbs = BaseVerbs | "search" | "upsert" | "update" | "import";
type DocumentsActions = `documents:${DocumentsVerbs}`;

type NonDocumentsVerbs = BaseVerbs | "list";
type CollectionsActions = `collections:${NonDocumentsVerbs}`;
type AliasesActions = `aliases:${NonDocumentsVerbs}`;
type SynonymsActions = `synonyms:${NonDocumentsVerbs}`;
type OverridesActions = `overrides:${NonDocumentsVerbs}`;
type KeysActions = `keys:${NonDocumentsVerbs}`;

type MiscActions = "metrics.json:list" | "debug:list" | "*";

type Actions =
  | DocumentsActions
  | CollectionsActions
  | AliasesActions
  | SynonymsActions
  | OverridesActions
  | KeysActions
  | MiscActions;

type KeyCreateSchema = {
  actions: Actions[];
  collections: string[];
  description?: string;
  value?: string;
  expires_at?: number;
};

type KeyDeleteSchema = {
  id: number;
};

type KeySchema = KeyCreateSchema & {
  id: number;
};

type KeysRetrieveSchema = {
  keys: KeySchema[];
};

// @TODO What was this used for? It is unused right now
type GenerateScopedSearchKeyParams = Partial<SearchParams> & {
  expires_at?: number;
  cache_ttl?: number;
};

export type {
  GenerateScopedSearchKeyParams,
  KeyCreateSchema,
  KeyDeleteSchema,
  KeySchema,
  KeysRetrieveSchema,
};
