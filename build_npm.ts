import { build, emptyDir } from "https://deno.land/x/dnt@0.23.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  scriptModule: false,
  rootTestDir: "./tests",
  package: {
    name: "@i-xi-dev/pubsub",
    version: "2.0.1",
    description: "A JavaScript Pub/Sub Broker.",
    license: "MIT",
    author: "i-xi-dev",
    homepage: "https://github.com/i-xi-dev/pubsub.es#readme",
    keywords: [
      "pubsub",
      "browser",
      "deno",
      "nodejs"
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/i-xi-dev/pubsub.es.git"
    },
    bugs: {
      url: "https://github.com/i-xi-dev/pubsub.es/issues"
    },
    publishConfig: {
      access: "public"
    },
    files: [
      "esm",
      "types"
    ],
  },
  importMap: "./import_map.json"
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
