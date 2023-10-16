import type { Rule } from "eslint";
import makeModuleListener from "../utils/makeModuleListener";

export const ERROR_MESSAGE_ID = "remove-extraneous-index";

export const NoExtraneousIndexRule: Rule.RuleModule = {
  create: (context): Rule.RuleListener =>
    makeModuleListener((statement) => {
      if (
        statement.source.endsWith("/index") &&
        statement.source !== "./index"
      ) {
        context.report({
          node: statement.node,
          messageId: ERROR_MESSAGE_ID,
        });
      }
    }),
  meta: {
    messages: {
      [ERROR_MESSAGE_ID]:
        "Including '/index' in this import statement is unnecessary and can be removed",
    },
  },
};
