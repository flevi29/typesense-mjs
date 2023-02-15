import {
  CollectionCreateSchema,
  CollectionFields,
  Collections,
  Config,
  Documents,
  Infer,
} from "../../src/mod.ts";
import { env } from "./shared/env.ts";

const collectionName = "TESTCollection";

const fields = {
  title: { type: "string" },
  authors: { type: "string[]" },
  publisher: { type: "string", optional: true },
  publication_year: { type: "int32", optional: true },
  isbn: { type: "string", index: false, optional: true },
} as const satisfies CollectionFields;

const schema: CollectionCreateSchema = {
  name: collectionName,
  fields,
};

const baseUrl = new URL(`http://localhost:${env.PORT}`);
const config = new Config(baseUrl, env.API_KEY);
const collections = new Collections(config);

if (await collections.exists(collectionName)) {
  await collections.delete(collectionName);
}
await collections.create(schema);

const documents = new Documents<Infer<typeof fields>>(
  config,
  collectionName,
);

const var1 = await documents.indexDocument({
  id: "1",
  title: "Title Titleson",
  authors: ["James Charles"],
}, { action: "create" });
console.log(var1);
await documents.indexDocument({
  id: "1",
  title: "Title Titleson",
  authors: ["James Charles"],
}, { action: "create" }).catch(console.error);
const var2 = await documents.indexDocument({
  id: "1",
  title: "Jordan Petersons nonsense",
}, { action: "update" });
console.log(var2);
const var3 = await documents.indexDocument({
  id: "1",
  title: "Jordan Peterson's Nonsensical",
  authors: ["Jack Nicholson"],
}, { action: "upsert" });
console.log(var3);
const var4 = await documents.indexDocument({
  id: "2",
  title: "Some Nonsense",
  authors: ["Durante"],
}, { action: "upsert" });
console.log(var4);
const var5 = await documents.indexDocument({
  id: "2",
  title: "Some Nonsense",
  authors: [],
  publisher: "Giovanni",
  isbn: "SKDJF-#$%J#%KJ",
}, { action: "upsert" });
console.log(var5);
