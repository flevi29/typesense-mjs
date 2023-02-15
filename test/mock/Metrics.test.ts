// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Metrics.spec.js
//
// mod.describe("Metrics", () => {
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
//     mod.it("retrieves metrics", async () => {
//       fm.get(
//         new URL("/metrics.json", url).toString(),
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
//       const returnData = await typesense.metrics.retrieve();
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
// });
