import type { ESLint } from "eslint";
import { NoDotImportRule } from "./rules/no-dot-import";
import { NoExtraneousIndexRule } from "./rules/no-extraneous-index";

const plugin: ESLint.Plugin = {
  rules: {
    "no-dot-import": NoDotImportRule,
    "no-extraneous-index": NoExtraneousIndexRule,
  },
};

export = plugin;
