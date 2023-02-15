import { load, z } from "../../../dev_deps.ts";

export const env = Object.freeze(
  z.object({
    API_KEY: z.string(),
    PORT: z.coerce.number().min(1).max(65535),
  }).parse(await load()),
);
