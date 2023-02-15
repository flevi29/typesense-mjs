import {
  Collections,
  Config,
  Documents,
  TypesenseError,
} from "../../src/mod.ts";
import { env } from "./shared/env.ts";

const config = new Config(`http://localhost:${env.PORT}`, env.API_KEY);
const collections = new Collections(config);
const COLL_NAME = "somecoll";
const documents = new Documents(config, COLL_NAME);

for (const { name } of await collections.retrieveAll()) {
  await collections.delete(name);
}

console.log(await collections.create({
  name: COLL_NAME,
  fields: [
    {
      name: "a",
      type: "object[]",
    },
  ],
  enable_nested_fields: true,
}).catch((reason) => {
  if (
    !(reason instanceof TypesenseError) ||
    reason.code !== "OBJECT_ALREADY_EXISTS"
  ) {
    throw reason;
  }
}));

console.log(await collections.create({
  name: "some_other_coll",
  fields: [
    {
      name: "b",
      type: "string[]",
    },
  ],
  enable_nested_fields: false,
}, { src_name: COLL_NAME }).catch((reason) => {
  if (
    !(reason instanceof TypesenseError) ||
    reason.code !== "OBJECT_ALREADY_EXISTS"
  ) {
    throw reason;
  }
}));
