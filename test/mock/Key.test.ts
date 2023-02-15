// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Key from "../../src/Typesense/Key.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Key.spec.js
//
// mod.describe("Key", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let key: Key;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//     key = typesense.keys(123);
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves the key", async () => {
//       fm.get(
//         new URL("/keys/123", url).toString(),
//         new Response("{}", {
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
//       const returnData = await key.retrieve();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
//
//   mod.describe(".delete", () => {
//     mod.it("deletes a key", async () => {
//       fm.delete(
//         new URL("/keys/123", url).toString(),
//         new Response("{}", {
//           status: 200,
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
//       const returnData = await key.delete();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
// });
