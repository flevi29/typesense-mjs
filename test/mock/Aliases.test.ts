// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Aliases from "../../src/Typesense/Aliases.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Aliases.spec.js
//
// // @TODO: types might not be in check, needs testing with a real Typesense client so mocked data might be more representative of reality
// mod.describe("Aliases", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let aliases: Aliases;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//     aliases = typesense.aliases();
//   });
//
//   mod.describe(".upsert", () => {
//     mod.it("upserts an alias", async () => {
//       fm.put(
//         new URL("/aliases/books", url).toString(),
//         new Response("{}", {
//           status: 201,
//           headers: {
//             "Content-Type": "application/json; charset=utf-8",
//           },
//         }),
//         {
//           body: {
//             collection_name: "books_january",
//           },
//           headers: {
//             // Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await aliases.upsert("books", {
//         collection_name: "books_january",
//       });
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves all aliases", async () => {
//       fm.get(
//         new URL("/aliases", url).toString(),
//         new Response("[]", {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json; charset=utf-8",
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
//       const returnData = await aliases.retrieve();
//
//       asserts.assertEquals(returnData, []);
//     });
//   });
// });
