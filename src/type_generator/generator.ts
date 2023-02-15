import { type Collections } from "../typesense/collections/collections.ts";
import {
  CollectionCreateSchema,
  CollectionSchema,
  FieldType,
} from "../typesense/collections/model.ts";

function typesenseTypeToTSType(fType: FieldType) {
  const conversionResult = fType === "string"
    ? "string"
    : fType === "int32" || fType === "int64" || fType === "float"
    ? "number"
    : fType === "bool"
    ? "boolean"
    // @TODO geopoint might be wrong
    : fType === "geopoint"
    ? "[number, number]"
    : fType === "geopoint[]"
    ? "[number, number][]"
    : fType === "string[]"
    ? "string[]"
    : fType === "int32[]" || fType === "int64[]" || fType === "float[]"
    ? "number[]"
    : fType === "bool[]"
    ? "boolean[]"
    : fType === "string*"
    ? "string | string[]"
    : fType === "object"
    ? "object"
    : fType === "object[]"
    ? "object[]"
    : fType === "auto"
    ? "unknown"
    : new Error(`unhandled field type: "${fType}"`);
  if (conversionResult instanceof Error) {
    throw conversionResult;
  }
  return conversionResult;
}

type Overrides = { [field: string]: string };

function getTypeName(overrides: Overrides | undefined, name: string) {
  const override = overrides?.[name];
  if (override === undefined) {
    return `"${name}"`;
  }
  return `[field: \`${override}\`]`;
}

const DENO_LINT_DISABLE = "// deno-lint-ignore-file";
const ESLINT_DISABLE = "/* eslint-disable */";

function generateTypesFromSchema(
  schema: CollectionCreateSchema | CollectionSchema,
  overrides?: Overrides,
) {
  let typeString =
    `${DENO_LINT_DISABLE}\n${ESLINT_DISABLE}\n\ntype TypesenseSchema = {\n  id: string;\n`;
  for (const { name, type, optional } of schema.fields) {
    typeString += `  ${getTypeName(overrides, name)}${
      optional === true ? "?" : ""
    }: ${typesenseTypeToTSType(type)};\n`;
  }
  return typeString + "};\n\nexport default TypesenseSchema;\n";
}

async function generateTypesFromCollection(
  collections: Collections,
  collection: string,
  overrides?: Overrides,
) {
  const schema = await collections.retrieve(collection);
  return generateTypesFromSchema(schema, overrides);
}

export { generateTypesFromCollection, generateTypesFromSchema };
