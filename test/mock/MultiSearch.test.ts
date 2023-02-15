// import { asserts, fm, mod } from "../../dev_deps.ts";
// import { Client as TypesenseClient } from "../../src/mod.ts";
//
// // https://github.com/typesense/typesense-js/blob/master/test/Typesense/MultiSearch.spec.js
//
// mod.describe("MultiSearch", () => {
//   const url = new URL("http://node0:8108");
//   const apiKey = "abcd";
//   let typesense: TypesenseClient;
//   mod.beforeEach(() => {
//     typesense = new TypesenseClient({
//       nodes: [url],
//       apiKey,
//       randomizeNodes: false,
//       cacheSearchResultsForSeconds: 2 * 60,
//     });
//   });
//
//   mod.describe(".perform", () => {
//     mod.it("performs a multi-search", async () => {
//       const searches = {
//         searches: [{ q: "term1" }, { q: "term2" }],
//       };
//       const commonParams = {
//         collection: "docs",
//         query_by: "field",
//       };
//
//       mockAxios
//         .onPost(
//           apiCall.uriFor("/multi_search", typesense.configuration.nodes[0]),
//           searches,
//           {
//             Accept: "application/json, text/plain, */*",
//             "Content-Type": "application/json",
//             "X-TYPESENSE-API-KEY": typesense.configuration.apiKey,
//           },
//         )
//         .reply((config) => {
//           expect(config.params).to.deep.equal(commonParams);
//           return [200, "{}", { "content-type": "application/json" }];
//         });
//
//       let returnData = await typesense.multiSearch.perform(
//         searches,
//         commonParams,
//       );
//
//       expect(returnData).to.eventually.deep.equal({}).notify(done);
//     });
//
//     it("searches with and without cache", async function () {
//       let searchRequests = [
//         {
//           searches: [{ q: "term1" }, { q: "term2" }],
//         },
//         {
//           searches: [{ q: "term2" }, { q: "term3" }],
//         },
//       ];
//       let commonParams = [
//         {
//           collection: "docs",
//           query_by: "field",
//         },
//         {
//           collection: "notes",
//           query_by: "field",
//         },
//       ];
//       let stubbedSearchResults = [{ results1: [] }, { results2: [] }];
//
//       searchRequests.forEach((_, i) => {
//         mockAxios
//           .onPost(
//             apiCall.uriFor("/multi_search", typesense.configuration.nodes[0]),
//             searchRequests[i],
//             {
//               Accept: "application/json, text/plain, */*",
//               "Content-Type": "application/json",
//               "X-TYPESENSE-API-KEY": typesense.configuration.apiKey,
//             },
//           )
//           .reply((config) => {
//             expect(config.params).to.deep.equal(commonParams[i]);
//             return [200, JSON.stringify(stubbedSearchResults[i]), {
//               "content-type": "application/json",
//             }];
//           });
//       });
//
//       let currentTime = Date.now();
//       timekeeper.freeze(currentTime);
//
//       let returnData = [
//         await typesense.multiSearch.perform(searchRequests[0], commonParams[0]),
//         await typesense.multiSearch.perform(searchRequests[0], commonParams[0]), // Repeat the same query a 2nd time, to test caching
//         await typesense.multiSearch.perform(searchRequests[1], commonParams[1]), // Now do a different query
//       ];
//
//       // Only two requests should be made, since one of them was cached
//       expect(mockAxios.history["post"].length).to.equal(2);
//
//       expect(returnData[0]).to.deep.equal(stubbedSearchResults[0]);
//       expect(returnData[1]).to.deep.equal(stubbedSearchResults[0]); // Same response should be returned
//       expect(returnData[2]).to.deep.equal(stubbedSearchResults[1]);
//
//       // Now wait 60s and then retry the request, still should be fetched from cache
//       timekeeper.freeze(currentTime + 60 * 1000);
//       returnData.push(
//         await typesense.multiSearch.perform(searchRequests[1], commonParams[1]),
//       );
//       expect(returnData[3]).to.deep.equal(stubbedSearchResults[1]);
//
//       // No new requests should have been made
//       expect(mockAxios.history["post"].length).to.equal(2);
//
//       // Now wait 2 minutes and then retry the request, it should now make an actual request, since cache is stale
//       timekeeper.freeze(currentTime + 121 * 1000);
//       returnData.push(
//         await typesense.multiSearch.perform(searchRequests[1], commonParams[1]),
//       );
//       expect(returnData[4]).to.deep.equal(stubbedSearchResults[1]);
//
//       // One new request should have been made
//       expect(mockAxios.history["post"].length).to.equal(3);
//       timekeeper.reset();
//     });
//   });
// });
