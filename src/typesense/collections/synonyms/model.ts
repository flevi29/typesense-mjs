type SynonymSchema = {
  id: string;
  synonyms: string[];
  root?: string;
  locale?: string;
  symbols_to_index?: string[];
};

type SynonymDeleteSchema = {
  id: string;
};

type SynonymsRetrieveSchema = {
  synonyms: SynonymSchema[];
};

export type { SynonymDeleteSchema, SynonymSchema, SynonymsRetrieveSchema };
