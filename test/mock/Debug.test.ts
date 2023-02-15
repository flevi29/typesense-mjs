// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Debug.spec.js
//
// mod.describe("Debug", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves debugging information", async () => {
//       const debugInfo = { version: "0.8.0" };
//       fm.get(
//         new URL("/debug", url).toString(),
//         new Response(JSON.stringify(debugInfo), {
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
//       const returnData = await typesense.debug.retrieve();
//
//       asserts.assertEquals(returnData, debugInfo);
//     });
//   });
// });
