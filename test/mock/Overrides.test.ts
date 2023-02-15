// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import type { OverrideSchema } from "../../src/Typesense/Override.ts";
// import type Overrides from "../../src/Typesense/Overrides.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Overrides.spec.js
//
// mod.describe("Overrides", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let overrides: Overrides;
//   let override: OverrideSchema;
//
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//
//     override = {
//       id: "lex-exact",
//       rule: {
//         query: "lex luthor",
//         match: "exact",
//       },
//       includes: [{ id: "125", position: 1 }],
//       excludes: [{ id: "124" }],
//     };
//
//     overrides = typesense.collections("companies").overrides();
//   });
//
//   mod.describe(".create", () => {
//     mod.it("creates the override in the collection", async () => {
//       fm.put(
//         new URL("/collections/companies/overrides/lex-exact", url).toString(),
//         new Response(JSON.stringify(override), {
//           status: 201,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//         {
//           body: override,
//           headers: {
//             //Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await overrides.upsert("lex-exact", override);
//
//       asserts.assertEquals(returnData, override);
//     });
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves all overrides", async () => {
//       fm.get(
//         new URL("/collections/companies/overrides", url).toString(),
//         new Response(JSON.stringify([override]), {
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
//       const returnData = await overrides.retrieve();
//
//       asserts.assertEquals(returnData, [override]);
//     });
//   });
// });
