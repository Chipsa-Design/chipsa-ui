import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("plugin:astro/recommended"), {
  ignores: [
    "node_modules/**",
    "dist/**",
    ".astro/**",
  ],
}];

export default eslintConfig;
