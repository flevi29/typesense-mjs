// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Operations.spec.js
//
// mod.describe("Operations", () => {
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
//   mod.describe(".perform", () => {
//     mod.it("performs the operation", async () => {
//       fm.post(
//         `begin:${new URL("/operations/snapshot", url).toString()}`,
//         (url) => {
//           asserts.assertEquals(
//             new URL(url).searchParams.get("snapshot_path"),
//             "/tmp/dbsnap",
//           );
//           return new Response("{}", {
//             status: 200,
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });
//         },
//         {
//           headers: {
//             //Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": apiKey,
//           },
//         },
//       );
//
//       const returnData = await typesense.operations.perform("snapshot", {
//         snapshot_path: "/tmp/dbsnap",
//       });
//
//       asserts.assertEquals(returnData, {});
//     });
//   });
// });
