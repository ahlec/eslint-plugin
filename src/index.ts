import type { ESLint } from "eslint";
import { NoDotImportRule } from "./rules/no-dot-import";

const plugin: ESLint.Plugin = {
  rules: {
    "no-dot-import": NoDotImportRule,
  },
};

export = plugin;
