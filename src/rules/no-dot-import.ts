import type { Rule } from "eslint";

export const ERROR_MESSAGE_ID = "prefer-dot-index";

export const NoDotImportRule: Rule.RuleModule = {
  create: (context): Rule.RuleListener => ({
    ImportDeclaration: (node) => {
      if (!node.source.value) {
        return;
      }

      if (node.source.value === ".") {
        context.report({
          node,
          messageId: ERROR_MESSAGE_ID,
        });
      }
    },
  }),
  meta: {
    messages: {
      [ERROR_MESSAGE_ID]: "Prefer importing from './index' instead",
    },
  },
};
