import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      name: "test",
      entry: resolve(__dirname, "./src/index.ts"),
      fileName: (format, name) => {
        // if (format === "es") {
        //   return `${name}.js`;
        // }

        return `${name}.${format}.js`;
      },
    },
  },
  plugins: [
    dts({ tsconfigPath: "./tsconfig.json", exclude: ["**/*.test.ts"] }),
  ],
});
