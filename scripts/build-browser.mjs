import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entryPoint = resolve(root, "src/index.ts");
const outdir = resolve(root, "dist/browser");
const commonOptions = {
  bundle: true,
  entryPoints: [entryPoint],
  platform: "browser",
  sourcemap: true,
  target: "es2020",
};

await mkdir(outdir, { recursive: true });

await Promise.all([
  build({
    ...commonOptions,
    format: "iife",
    globalName: "FundApi",
    outfile: resolve(outdir, "fund-api.iife.js"),
  }),
  build({
    ...commonOptions,
    format: "iife",
    globalName: "FundApi",
    minify: true,
    outfile: resolve(outdir, "fund-api.iife.min.js"),
  }),
  build({
    ...commonOptions,
    format: "esm",
    outfile: resolve(outdir, "fund-api.esm.mjs"),
  }),
  build({
    ...commonOptions,
    format: "esm",
    minify: true,
    outfile: resolve(outdir, "fund-api.esm.min.mjs"),
  }),
]);
