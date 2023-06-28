import { build } from "esbuild";

build({
  entryPoints: ["main.ts"],
  outfile: "dest/idbx.js",
  bundle: true,
  sourcemap: true,
  minify: true,
  format: "esm",
  target: ["ESNext"],
}).catch(() => process.exit(1));
