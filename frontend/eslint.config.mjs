// eslint.config.mjs

import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

const config = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  prettier,
  {
    ignores: [
      ".next/**/*",
      "node_modules/**/*",
      "out/**/*",
      "*.config.*js"
    ]
  },
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          trailingComma: "es5",
          printWidth: 120,
          tabWidth: 2,
          semi: true,
          arrowParens: "always"
        }
      ]
    }
  }
];

export default config;
