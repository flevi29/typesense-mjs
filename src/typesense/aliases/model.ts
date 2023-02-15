type CollectionAliasSchema = {
  name: string;
  collection_name: string;
};

type CollectionAliasesResponseSchema = {
  aliases: CollectionAliasSchema[];
};

export type { CollectionAliasesResponseSchema, CollectionAliasSchema };
