const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["main.ts"],
    outdir: "dest",
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: "esm",
    target: ["ESNext"],
  })
  .catch(() => process.exit(1));
