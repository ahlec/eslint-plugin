import type { Rule } from "eslint";
import makeModuleListener from "../utils/makeModuleListener";

export const ERROR_MESSAGE_ID = "remove-extraneous-index";

export const NoExtraneousIndexRule: Rule.RuleModule = {
  create: (context): Rule.RuleListener =>
    makeModuleListener((statement) => {
      const match = statement.source.match(/^(.*)(\/|\\)index$/);
      if (match && statement.source !== "./index") {
        context.report({
          node: statement.node,
          messageId: ERROR_MESSAGE_ID,
          fix: (fixer) =>
            fixer.replaceText(statement.sourceNode, `"${match[1]}"`),
        });
      }
    }),
  meta: {
    fixable: "code",
    messages: {
      [ERROR_MESSAGE_ID]:
        "Including '/index' in this import statement is unnecessary and can be removed",
    },
  },
};
