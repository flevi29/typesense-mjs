// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Keys from "../../src/Typesense/Keys.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Keys.spec.js
//
// mod.describe("Keys", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let keys: Keys;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//     keys = typesense.keys();
//   });
//
//   mod.describe(".create", () => {
//     mod.it("creates a key", async () => {
//       fm.post(
//         new URL("/keys", url).toString(),
//         new Response("{}", {
//           status: 201,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//         {
//           body: {
//             description: "Search-only key.",
//             actions: ["documents:search"],
//             collections: ["*"],
//           },
//           headers: {
//             //Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await keys.create({
//         description: "Search-only key.",
//         actions: ["documents:search"],
//         collections: ["*"],
//       });
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves all keys", async () => {
//       fm.get(
//         new URL("/keys", url).toString(),
//         new Response("[]", {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json",
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
//       const returnData = await keys.retrieve();
//
//       asserts.assertEquals(returnData, []);
//     });
//   });
// });
