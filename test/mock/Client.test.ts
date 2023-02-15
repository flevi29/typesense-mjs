// import { asserts, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/Client.spec.js
//
// const nodes = [new URL("http://node0:8108")];
//
// mod.describe("Client", function () {
//   let typesense: TypesenseClient;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes,
//       apiKey: "abcd",
//       randomizeNodes: false,
//     });
//   });
//   mod.it("should set the right default configuration values", () => {
//     asserts.assertEquals(typesense.configuration.nodes, nodes);
//     // @TODO: connectionTimeoutSeconds missing in new version, add back, or remove test?
//     // asserts.assertEquals(typesense.configuration.connectionTimeoutSeconds, 5);
//     asserts.assertEquals(typesense.configuration.apiKey, "abcd");
//   });
//   mod.it("should allow custom user headers to be passed in", () => {
//     typesense = new TypesenseClient({
//       nodes,
//       apiKey: "abcd",
//       randomizeNodes: false,
//       additionalHeaders: {
//         "CF-Access-Client-Id": "abcd",
//       },
//     });
//     asserts.assertEquals(
//       typesense.configuration.additionalHeaders?.["CF-Access-Client-Id"],
//       "abcd",
//     );
//   });
// });
