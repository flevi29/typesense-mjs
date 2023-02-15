// import { asserts, fm, md, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
// import ApiCall from "../../src/Typesense/ApiCall.ts";
// import { ObjectUnprocessable } from "../../src/Typesense/Errors/index.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/ApiCall.spec.js
//
// const sharedNodeSelectionBehavior = (
//   method: "GET" | "POST" | "DELETE" | "PUT",
//   methodFn: keyof ApiCall,
// ) => {
//   const nodes: URL[] = [
//     new URL("http://node0:8108"),
//     new URL("http://node1:7108"),
//     new URL("http://node2:9108"),
//   ];
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   let apiCall: ApiCall;
//
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes,
//       apiKey,
//       randomizeNodes: false,
//       retryIntervalSeconds: 0.001, // To keep tests fast
//     });
//     apiCall = new ApiCall(typesense.configuration);
//     fm.resetHistory();
//     fm.resetBehavior();
//   });
//
//   mod.it(
//     "does not retry when HTTPStatus >= 300 and HTTPStatus < 500",
//     async () => {
//       const [url1, url2, url3] = typesense.configuration.nodes;
//       fm.mock(
//         url1.toString(),
//         new Response(JSON.stringify({ message: "Already exists" }), {
//           status: 409,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//       ).mock(
//         url2.toString(),
//         new Response(JSON.stringify({ message: "Unprocessable" }), {
//           status: 422,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//       ).mock(
//         url3.toString(),
//         new Response(JSON.stringify({ message: "Error message" }), {
//           status: 500,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//       );
//
//       await asserts.assertRejects(
//         () => apiCall[methodFn]("/"),
//         "Request failed with HTTP code 409 | Server said: Already exists",
//       );
//       await asserts.assertRejects(
//         () => apiCall[methodFn]("/"),
//         ObjectUnprocessable,
//       );
//
//       const requestHistory = fm.calls("*", method);
//       asserts.assertEquals(requestHistory.length, 2);
//       asserts.assertEquals(requestHistory[0][0], "http://node0:8108/");
//       asserts.assertEquals(requestHistory[1][0], "http://node1:7108/");
//     },
//   );
//
//   mod.it("raises an error when no nodes are healthy", async () => {
//     const [url1, url2, url3] = typesense.configuration.nodes;
//     fm.mock(
//       url1.toString(),
//       new Response(JSON.stringify({ message: "Error message" }), {
//         status: 500,
//         headers: { "content-type": "application/json" },
//       }),
//     ).mock(
//       url2.toString(),
//       new Response(JSON.stringify({ message: "Error message" }), {
//         status: 500,
//         headers: { "content-type": "application/json" },
//       }),
//     ).mock(
//       url3.toString(),
//       new Response(JSON.stringify({ message: "Error message" }), {
//         status: 500,
//         headers: { "content-type": "application/json" },
//       }),
//     );
//
//     await asserts.assertRejects(
//       () => apiCall[methodFn]("/"),
//       "Request failed with HTTP code 500 | Server said: Error message",
//     );
//     const requestHistory = fm.calls("*", method);
//     asserts.assertEquals(requestHistory.length, 4);
//     asserts.assertEquals(requestHistory[0][0], "http://node0:8108/");
//     asserts.assertEquals(requestHistory[1][0], "http://node1:7108/");
//     asserts.assertEquals(requestHistory[2][0], "http://node2:9108/");
//     asserts.assertEquals(requestHistory[3][0], "http://node0:8108/");
//   });
//
//   mod.it(
//     "selects the next available node when there is a connection timeout",
//     async () => {
//       const [url1, url2, url3] = typesense.configuration.nodes;
//       fm.mock(
//         url1.toString(),
//         { throws: { ...new Error("timed out"), code: "ECONNABORTED" } },
//       ).mock(
//         url2.toString(),
//         { throws: { ...new Error("timed out"), code: "ECONNABORTED" } },
//       ).mock(
//         url3.toString(),
//         new Response(JSON.stringify({ message: "Success" }), {
//           status: 200,
//           headers: { "content-type": "application/json" },
//         }),
//       );
//
//       asserts.assertEquals(
//         await apiCall[methodFn]("/"),
//         { message: "Success" },
//       );
//       const requestHistory = fm.calls("*", method);
//       asserts.assertEquals(requestHistory.length, 3);
//       asserts.assertEquals(requestHistory[0][0], "http://node0:8108/");
//       asserts.assertEquals(requestHistory[1][0], "http://node1:7108/");
//       asserts.assertEquals(requestHistory[2][0], "http://node2:9108/");
//     },
//   );
//
//   // @TODO: This needs more
//   mod.it.only(
//     "removes unhealthy nodes out of rotation, until threshold",
//     async () => {
//       const [url1, url2, url3] = typesense.configuration.nodes;
//       fm.mock(
//         url1.toString(),
//         { throws: { ...new Error("timed out"), code: "ECONNABORTED" } },
//       ).mock(
//         url2.toString(),
//         { throws: { ...new Error("timed out"), code: "ECONNABORTED" } },
//       ).mock(
//         url3.toString(),
//         new Response(JSON.stringify({ message: "Success" }), {
//           status: 200,
//           headers: { "content-type": "application/json" },
//         }),
//       );
//
//       const currentTime = Date.now();
//       md.set(currentTime);
//       await apiCall[methodFn]("/"); // Node 0 and Node 1 are marked as unhealthy after this, request should have been made to Node 2
//       await apiCall[methodFn]("/"); // Request should have been made to Node 2
//       await apiCall[methodFn]("/"); // Request should have been made to Node 2
//
//       md.set(currentTime + 5 * 1000);
//       await apiCall[methodFn]("/"); // Request should have been made to Node 2
//
//       md.set(currentTime + 65 * 1000);
//       await apiCall[methodFn]("/"); // Request should have been made to Node 2, since Node 0 and Node 1 are still unhealthy, though they were added back into rotation after the threshold
//
//       // Remove first mock, to let request to node 0 succeed
//       fm.mock(
//         url1.toString(),
//         new Response(JSON.stringify({ message: "Success" }), {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }),
//       );
//
//       md.set(currentTime + 185 * 1000);
//       await apiCall[methodFn]("/"); // Request should have been made to Node 0, since it is now healthy and the unhealthy threshold was exceeded
//
//       const requestHistory = fm.calls("*", method);
//       asserts.assertEquals(requestHistory.length, 10);
//       asserts.assertEquals(requestHistory[0][0], "http://node0:8108/");
//       asserts.assertEquals(requestHistory[1][0], "http://node1:7108/");
//       asserts.assertEquals(requestHistory[2][0], "http://node2:9108/");
//       asserts.assertEquals(requestHistory[3][0], "http://node2:9108/");
//       asserts.assertEquals(requestHistory[4][0], "http://node2:9108/");
//       asserts.assertEquals(requestHistory[5][0], "http://node2:9108/");
//       asserts.assertEquals(requestHistory[6][0], "http://node0:8108/");
//       asserts.assertEquals(requestHistory[7][0], "http://node1:7108/");
//       asserts.assertEquals(requestHistory[8][0], "http://node2:9108/");
//       asserts.assertEquals(requestHistory[9][0], "http://node0:8108/");
//
//       md.reset();
//     },
//   );
//
//   // @TODO: needs more research
//   // mod.describe("when a nearestNode is specified", () => {
//   //   mod.beforeEach(() => {
//   //     typesense = new TypesenseClient({
//   //       nearestNode: {
//   //         host: "nearestNode",
//   //         port: 6108,
//   //         protocol: "http",
//   //       },
//   //       nodes: [
//   //         {
//   //           host: "node0",
//   //           port: 8108,
//   //           protocol: "http",
//   //         },
//   //         {
//   //           host: "node1",
//   //           port: 7108,
//   //           protocol: "http",
//   //         },
//   //         {
//   //           host: "node2",
//   //           port: 9108,
//   //           protocol: "http",
//   //         },
//   //       ],
//   //       apiKey: "abcd",
//   //       randomizeNodes: false,
//   //       logLevel: "error",
//   //       retryIntervalSeconds: 0.001, // To keep tests fast
//   //     });
//   //     mockAxios = new MockAxiosAdapter(axios);
//   //     apiCall = new ApiCall(typesense.configuration);
//   //   });
//
//   //   mod.it(
//   //     "uses the nearestNode if it is present and healthy, otherwise fallsback to regular nodes",
//   //     async () => {
//   //       mockAxios.onAny(
//   //         apiCall.uriFor("/", typesense.configuration.nearestNode),
//   //       ).timeout();
//   //       mockAxios.onAny(
//   //         apiCall.uriFor("/", typesense.configuration.nodes[0]),
//   //       ).timeout();
//   //       mockAxios.onAny(
//   //         apiCall.uriFor("/", typesense.configuration.nodes[1]),
//   //       ).timeout();
//   //       mockAxios
//   //         .onAny(apiCall.uriFor("/", typesense.configuration.nodes[2]))
//   //         .reply(200, JSON.stringify({ message: "Success" }), {
//   //           "content-type": "application/json",
//   //         });
//
//   //       const currentTime = Date.now();
//   //       timekeeper.freeze(currentTime);
//   //       await apiCall[method]("/"); // Node nearestNode, Node 0 and Node 1 are marked as unhealthy after this, request should have been made to Node 2
//   //       await apiCall[method]("/"); // Request should have been made to Node 2
//   //       await apiCall[method]("/"); // Request should have been made to Node 2
//
//   //       timekeeper.freeze(currentTime + 5 * 1000);
//   //       await apiCall[method]("/"); // Request should have been made to Node 2
//
//   //       timekeeper.freeze(currentTime + 65 * 1000);
//   //       await apiCall[method]("/"); // Request should have been attempted to nearestNode, Node 0 and Node 1, but finally made to Node 2 (since disributedSearchNode, Node 0 and Node 1 are still unhealthy, though they were added back into rotation after the threshold)
//
//   //       // Remove first mock, to let request to nearestNode succeed
//   //       mockAxios.handlers[method].shift();
//   //       mockAxios
//   //         .onAny(
//   //           apiCall.uriFor("/", typesense.configuration.nearestNode),
//   //         )
//   //         .reply(200, JSON.stringify({ message: "Success" }), {
//   //           "content-type": "application/json",
//   //         });
//
//   //       timekeeper.freeze(currentTime + 185 * 1000);
//   //       await apiCall[method]("/"); // Request should have been made to nearestNode, since it is now healthy and the unhealthy threshold was exceeded
//   //       await apiCall[method]("/"); // Request should have been made to nearestNode, since no roundrobin if it is present and healthy
//   //       await apiCall[method]("/"); // Request should have been made to nearestNode, since no roundrobin if it is present and healthy
//
//   //       const requestHistory = mockAxios.history[method];
//   //       expect(requestHistory.length).to.equal(14);
//
//   //       expect(requestHistory[0].url).to.equal("http://nearestNode:6108/");
//   //       expect(requestHistory[1].url).to.equal("http://node0:8108/");
//   //       expect(requestHistory[2].url).to.equal("http://node1:7108/");
//   //       expect(requestHistory[3].url).to.equal("http://node2:9108/");
//
//   //       expect(requestHistory[4].url).to.equal("http://node2:9108/");
//
//   //       expect(requestHistory[5].url).to.equal("http://node2:9108/");
//
//   //       expect(requestHistory[6].url).to.equal("http://node2:9108/");
//
//   //       expect(requestHistory[7].url).to.equal("http://nearestNode:6108/");
//   //       expect(requestHistory[8].url).to.equal("http://node0:8108/");
//   //       expect(requestHistory[9].url).to.equal("http://node1:7108/");
//   //       expect(requestHistory[10].url).to.equal("http://node2:9108/");
//
//   //       expect(requestHistory[11].url).to.equal("http://nearestNode:6108/");
//
//   //       expect(requestHistory[12].url).to.equal("http://nearestNode:6108/");
//
//   //       expect(requestHistory[13].url).to.equal("http://nearestNode:6108/");
//
//   //       timekeeper.reset();
//   //     },
//   //   );
//
//   //   it("raises an error when no nodes are healthy", async () => {
//   //     mockAxios
//   //       .onAny(
//   //         apiCall.uriFor("/", typesense.configuration.nearestNode),
//   //       )
//   //       .reply(500, JSON.stringify({ message: "Error message" }), {
//   //         "content-type": "application/json",
//   //       });
//   //     mockAxios
//   //       .onAny(apiCall.uriFor("/", typesense.configuration.nodes[0]))
//   //       .reply(500, JSON.stringify({ message: "Error message" }), {
//   //         "content-type": "application/json",
//   //       });
//   //     mockAxios
//   //       .onAny(apiCall.uriFor("/", typesense.configuration.nodes[1]))
//   //       .reply(500, JSON.stringify({ message: "Error message" }), {
//   //         "content-type": "application/json",
//   //       });
//   //     mockAxios
//   //       .onAny(apiCall.uriFor("/", typesense.configuration.nodes[2]))
//   //       .reply(500, JSON.stringify({ message: "Error message" }), {
//   //         "content-type": "application/json",
//   //       });
//
//   //     await expect(apiCall[method]("/")).to.eventually.be.rejectedWith(
//   //       "Request failed with HTTP code 500 | Server said: Error message",
//   //     );
//   //     const requestHistory = mockAxios.history[method];
//   //     expect(requestHistory.length).to.equal(5);
//   //     expect(requestHistory[0].url).to.equal("http://nearestNode:6108/");
//   //     expect(requestHistory[1].url).to.equal("http://node0:8108/");
//   //     expect(requestHistory[2].url).to.equal("http://node1:7108/");
//   //     expect(requestHistory[3].url).to.equal("http://node2:9108/");
//   //     expect(requestHistory[4].url).to.equal("http://node0:8108/");
//   //   });
//   // });
// };
//
// mod.describe("ApiCall", () => {
//   mod.describe("Method Calls", () => {
//     mod.describe(".post", () => {
//       sharedNodeSelectionBehavior("POST", "postJSON");
//     });
//
//     mod.describe(".put", () => {
//       sharedNodeSelectionBehavior("PUT", "putJSON");
//     });
//
//     mod.describe(".get", () => {
//       sharedNodeSelectionBehavior("GET", "getJSON");
//     });
//
//     mod.describe(".delete", () => {
//       sharedNodeSelectionBehavior("DELETE", "deleteJSON");
//     });
//   });
//
//   // No more URL construction, it's global URL now
//
//   mod.describe("Custom Headers", () => {
//     mod.it(
//       "passes on additional user-provided headers in the request",
//       async () => {
//         const url = new URL("http://node0:8108/path");
//         const apiKey = "abcd";
//         const client = new TypesenseClient({
//           nodes: [url],
//           apiKey,
//           randomizeNodes: false,
//           additionalHeaders: {
//             "x-header-name": "value",
//           },
//         });
//
//         const apiCall = new ApiCall(client.configuration);
//
//         fm.get(
//           new URL("/collections", url).toString(),
//           new Response(JSON.stringify({}), {
//             status: 200,
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }),
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "X-TYPESENSE-API-KEY": apiKey,
//               "x-header-name": "value",
//             },
//           },
//         );
//
//         // Will error out if request doesn't match the stub
//         await apiCall.getJSON("/collections", {});
//       },
//     );
//   });
// });
