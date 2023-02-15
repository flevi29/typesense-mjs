// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Synonym from "../../src/Typesense/Synonym.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Synonym.spec.js
//
// mod.describe("Synonym", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let synonym: Synonym;
//
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//
//     synonym = typesense.collections("companies").synonyms("synonym-set-1");
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retreives the synonym with the given ID", async () => {
//       fm.get(
//         new URL("/collections/companies/synonyms/synonym-set-1", url)
//           .toString(),
//         new Response("{}", {
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
//       const returnData = await synonym.retrieve();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
//
//   mod.describe(".delete", () => {
//     mod.it("deletes the synonym with the given ID", async () => {
//       fm.delete(
//         new URL("/collections/companies/synonyms/synonym-set-1", url)
//           .toString(),
//         new Response("{}", {
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
//       const returnData = await synonym.delete();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
// });
