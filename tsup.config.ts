import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  outDir: "build/src",
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
});
