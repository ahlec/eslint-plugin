import { RuleTester } from "eslint";

export function createRuleTester(): RuleTester {
  return new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });
}
