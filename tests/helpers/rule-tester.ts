import { RuleTester } from "eslint";
import type { AhlecEslintPluginSettings } from "../../src/settings";

export function createRuleTester(
  settings: AhlecEslintPluginSettings = {},
): RuleTester {
  return new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
    settings,
  });
}
