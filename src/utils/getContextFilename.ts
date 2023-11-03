import type { Rule } from "eslint";

export function getContextFilename(context: Rule.RuleContext): string {
  if (context.filename) {
    // ESLint 8.40 onward: https://github.com/eslint/eslint/pull/17108
    return context.filename;
  }

  return context.getFilename();
}
