import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "generated/**", // prisma ke generated files ignore
    ],
  },

  // JavaScript config
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
    extends: [js.configs.recommended],
  },

  // TypeScript recommended configs
  ...tseslint.configs.recommended,

  // Extra overrides for TS files
  {
    files: ["**/*.{ts,cts,mts}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
]);
