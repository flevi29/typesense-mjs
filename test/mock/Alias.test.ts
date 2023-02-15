// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Alias from "../../src/Typesense/Alias.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Alias.spec.js
//
// mod.describe("Alias", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let alias: Alias;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//     alias = typesense.aliases("companies");
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves the alias", async () => {
//       fm.get(
//         new URL("/aliases/companies", url).toString(),
//         new Response("{}", {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json; charset=utf-8",
//           },
//         }),
//         {
//           headers: {
//             //Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await alias.retrieve();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
//
//   mod.describe(".delete", () => {
//     mod.it("deletes an alias", async () => {
//       fm.delete(
//         new URL("/aliases/companies", url).toString(),
//         new Response("{}", {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json; charset=utf-8",
//           },
//         }),
//         {
//           headers: {
//             //Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await alias.delete();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
// });
