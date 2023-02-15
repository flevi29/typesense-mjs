// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import Collection, {
//   CollectionSchema,
//   CollectionUpdateSchema,
// } from "../../src/Typesense/Collection.ts";
// import { CollectionCreateSchema } from "../../src/Typesense/Collections.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Collection.spec.js
//
// mod.describe("Collection", () => {
//   const path = "/collections/companies";
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let collection: Collection;
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
//   const url = new URL("http://node0:8108");
//
//   fm.get(
//     new URL(path, url).toString(),
//     new Response(JSON.stringify(companySchema), {
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
//     collection = typesense.collections("companies");
//   });
//
//   mod.describe(".retrieve", () => {
//     mod.it("retrieves a collection", async () => {
//       const returnData = await collection.retrieve();
//       asserts.assertEquals(returnData, companySchema);
//     });
//   });
//
//   mod.describe(".update", () => {
//     mod.it("updates a collection", async () => {
//       const updateSchema: CollectionUpdateSchema = {
//         fields: [{ name: "fieldX", drop: true, type: "int32" }],
//       };
//       // TODO: there's some type fuckery here, need better types
//       const returnSchema: CollectionSchema = <CollectionSchema> {
//         name: "THIS IS WRONG",
//         ...updateSchema,
//         created_at: 0,
//         num_documents: 0,
//         num_memory_shards: 0,
//       };
//       fm.patch(new URL(path, url).toString(), {
//         body: JSON.stringify(returnSchema),
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }, {
//         headers: {
//           "Content-Type": "application/json",
//           "X-TYPESENSE-API-KEY": apiKey,
//         },
//         body: updateSchema,
//       });
//
//       const returnData = await collection.update(updateSchema);
//       asserts.assertEquals(returnData, returnSchema);
//     });
//   });
//
//   mod.describe(".delete", () => {
//     mod.it("deletes a collection", async () => {
//       fm.delete(new URL(path, url).toString(), {
//         body: JSON.stringify(companySchema),
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }, {
//         headers: {
//           "Content-Type": "application/json",
//           "X-TYPESENSE-API-KEY": apiKey,
//         },
//       });
//
//       const returnData = await collection.delete();
//       asserts.assertEquals(returnData, companySchema);
//     });
//   });
// });
