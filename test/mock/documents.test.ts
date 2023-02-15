import { asserts, fm, mod } from "../dev_deps.ts";
import { Config, Documents } from "../src/mod.ts";
import { COLLECTIONS, DOCUMENTS } from "../src/typesense/path_segments.ts";
import {
  CollectionFields,
  MutationTypes,
  QueryTypes,
} from "../src/typesense/collection/model.ts";

mod.describe("documents", () => {
  const schema = {
    title: {
      type: "string",
      optional: false,
    },
  } as const satisfies CollectionFields;

  const baseURL = "https://192.168.100.101:8180";
  const apiKey = "key";
  const collectionName = "collectionName";
  const config = new Config(baseURL, apiKey);
  const documents = new Documents<typeof schema>(config, collectionName);

  mod.it("indexDocument", async () => {
    const actual: MutationTypes<typeof schema> = { title: "sauce" };

    // @TODO Un-mock
    fm.post(
      `${baseURL}/${COLLECTIONS}/${collectionName}/${DOCUMENTS}`,
      new Response(JSON.stringify(actual), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      {
        headers: {
          // Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "X-TYPESENSE-API-KEY": apiKey,
        },
      },
    );

    const expected = await documents.indexDocument(actual);
    asserts.assertEquals(actual, expected);
  });
});
