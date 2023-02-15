// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Health.spec.js
//
// mod.describe("Health", () => {
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
//     mod.it("retrieves health information", async () => {
//       fm.get(
//         new URL("/health", url).toString(),
//         new Response(JSON.stringify({ ok: true }), {
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
//       const returnData = await typesense.health.retrieve();
//
//       asserts.assertEquals(returnData, { ok: true });
//     });
//   });
// });
