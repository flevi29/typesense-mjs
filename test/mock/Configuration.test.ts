// import { asserts, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Configuration.spec.js
//
// mod.describe("Configuration", () => {
//   let typesense: TypesenseClient;
//
//   mod.it("randomizes nodes by default", () => {
//     for (let i = 0; i < 10; i++) {
//       typesense = new TypesenseClient({
//         nodes: [
//           new URL("https://node0"),
//           new URL("https://node1"),
//         ],
//         apiKey: "abcd",
//       });
//       if (typesense.configuration.nodes[0].host === "node1") {
//         asserts.assertEquals(typesense.configuration.nodes[0].host, "node1");
//         return;
//       }
//     }
//     asserts.assertEquals(typesense.configuration.nodes[0].host, "node1");
//   });
// });
