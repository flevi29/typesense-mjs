// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import { CollectionSchema } from "../../src/Typesense/Collection.ts";
// import Collections, {
//   CollectionCreateSchema,
// } from "../../src/Typesense/Collections.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Collections.spec.js
//
// mod.describe("Collections", () => {
//   const path = "/collections";
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let collections: Collections;
//   const url = new URL("http://node0:8108");
//   const companyCreationSchema: CollectionCreateSchema = {
//     name: "companies",
//     fields: [
//       {
//         name: "company_name",
//         type: "string",
//         facet: false,
//       },
//       {
//         name: "num_employees",
//         type: "int32",
//         facet: false,
//       },
//       {
//         name: "country",
//         type: "string",
//         facet: true,
//       },
//     ],
//     default_sorting_field: "num_employees",
//   };
//   const companySchema: CollectionSchema = {
//     ...companyCreationSchema,
//     num_documents: 0,
//     created_at: 0,
//     num_memory_shards: 0,
//   };
//
//   fm.post(
//     new URL(path, url).toString(),
//     new Response(JSON.stringify(companySchema), {
//       status: 201,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }),
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "X-TYPESENSE-API-KEY": apiKey,
//       },
//     },
//   );
//
//   fm.get(
//     new URL(path, url).toString(),
//     new Response(JSON.stringify([companySchema]), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }),
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "X-TYPESENSE-API-KEY": apiKey,
//       },
//     },
//   );
//
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//     });
//     collections = typesense.collections();
//   });
//
//   mod.describe(".create", () => {
//     mod.it("creates a collection", async () => {
//       const returnData = await collections.create(companyCreationSchema);
//       asserts.assertEquals(returnData, companySchema);
//     });
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves all collections", async () => {
//       const returnData = await collections.retrieve();
//       asserts.assertEquals(returnData, [companySchema]);
//     });
//   });
// });
