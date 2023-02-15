// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Synonyms from "../../src/Typesense/Synonyms.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Synonyms.spec.js
//
// mod.describe("Synonyms", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let synonyms: Synonyms;
//   // @TODO: This is not "used" anywhere, find out where it should be
//   let synonym: any;
//
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//
//     synonyms = typesense.collections("companies").synonyms();
//   });
//
//   mod.describe(".create", () => {
//     mod.it("creates the synonym in the collection", async () => {
//       fm.put(
//         new URL("/collections/companies/synonyms/synonym-set-1", url)
//           .toString(),
//         new Response("{}", {
//           status: 201,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//         {
//           body: synonym,
//           headers: {
//             // Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await synonyms.upsert("synonym-set-1", {});
//       asserts.assertEquals(returnData, {});
//     });
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves all synonyms", async () => {
//       fm.get(
//         new URL("/collections/companies/synonyms", url)
//           .toString(),
//         new Response("[]", {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//         {
//           headers: {
//             // Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await synonyms.retrieve();
//       asserts.assertEquals(returnData, []);
//     });
//   });
// });
