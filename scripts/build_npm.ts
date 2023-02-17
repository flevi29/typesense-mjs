import { build, emptyDir } from "../dev_deps.ts";
import { default as denoJson } from "../deno.json" assert { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: { undici: true },
  typeCheck: true,
  test: false,
  declaration: true,
  scriptModule: false,
  esModule: true,
  package: {
    // package.json properties
    name: "typesense_mjs_test",
    version: denoJson.version,
    description: "TypeScript Typesense client for Node and modern browsers.",
    license: "Apache License 2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/flevi29/typesense_mjs.git",
    },
    bugs: {
      url: "https://github.com/flevi29/typesense_mjs/issues",
    },
    devDependencies: {
      "@types/node": "^18.13.0",
    },
  },
  compilerOptions: {
    target: "Latest",
    lib: ["dom"],
  },
  packageManager: "pnpm",
});

// post build steps
// Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
