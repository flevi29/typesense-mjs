// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type Override from "../../src/Typesense/Override.ts";
// import type { OverrideSchema } from "../../src/Typesense/Override.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Override.spec.js
//
// mod.describe("Override", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let overrideData: OverrideSchema;
//   let override: Override;
//
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//
//     overrideData = {
//       id: "lex-exact",
//       rule: {
//         query: "lex luthor",
//         match: "exact",
//       },
//       includes: [{ id: "125", position: 1 }],
//       excludes: [{ id: "124" }],
//     };
//
//     override = typesense.collections("companies").overrides("lex-exact");
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retreives the override with the given ID", async () => {
//       fm.get(
//         new URL("/collections/companies/overrides/lex-exact", url).toString(),
//         new Response(JSON.stringify(overrideData), {
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
//       const returnData = await override.retrieve();
//
//       asserts.assertEquals(returnData, overrideData);
//     });
//   });
//
//   mod.describe(".delete", () => {
//     mod.it("deletes the override with the given ID", async () => {
//       const stubbedResult = { id: "lex-exact" };
//       fm.delete(
//         new URL("/collections/companies/overrides/lex-exact", url).toString(),
//         new Response(JSON.stringify(stubbedResult), {
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
//       const returnData = await override.delete();
//
//       asserts.assertEquals(returnData, stubbedResult);
//     });
//   });
// });
