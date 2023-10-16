import type { Rule } from "eslint";
import makeModuleListener from "../utils/makeModuleListener";

export const ERROR_MESSAGE_ID = "prefer-dot-index";

export const NoDotImportRule: Rule.RuleModule = {
  create: (context): Rule.RuleListener =>
    makeModuleListener((statement) => {
      if (statement.source === ".") {
        context.report({
          node: statement.node,
          messageId: ERROR_MESSAGE_ID,
        });
      }
    }),
  meta: {
    messages: {
      [ERROR_MESSAGE_ID]: "Prefer importing from './index' instead",
    },
  },
};
