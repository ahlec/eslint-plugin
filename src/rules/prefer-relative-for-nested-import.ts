import path from "path";
import type { Rule } from "eslint";
import { cleanImportPath } from "../utils/cleanImportPath";
import { isRelativePathToParent } from "../utils/fs";
import getAliases from "../utils/getAliases";
import { getContextFilename } from "../utils/getContextFilename";
import makeModuleListener from "../utils/makeModuleListener";

export const ERROR_MESSAGE_ID = "prefer-relative";

export const PreferRelativeForNestedImport: Rule.RuleModule = {
  create: (context): Rule.RuleListener => {
    const allAliases = getAliases(context.settings);
    const currentDirectory = path.dirname(getContextFilename(context));

    return makeModuleListener((statement) => {
      // Find if there is any alias that match the path being imported
      // We'll only consider the first one that matches because it's unclear
      // how to resolve multiple possible alias matches
      const aliasDefinition = allAliases.find((definition) =>
        definition.matchesAlias(statement.source),
      );

      // If this import isn't using any registered aliases, it isn't affected
      // by this rule
      if (!aliasDefinition) {
        return;
      }

      // Convert the alias into an absolute path
      const absoluteFilepath = aliasDefinition.convertToAbsolute(
        statement.source,
      );

      // Make the absolute path relative to this directory
      const relativeFilepath = cleanImportPath(
        path.relative(currentDirectory, absoluteFilepath),
      );

      // If relative filepath would traverse to a higher directory, then we
      // should keep this as an alias
      if (isRelativePathToParent(relativeFilepath)) {
        return;
      }

      context.report({
        node: statement.node,
        messageId: ERROR_MESSAGE_ID,
        fix: (fixer) =>
          fixer.replaceText(statement.sourceNode, `"./${relativeFilepath}"`),
      });
    });
  },
  meta: {
    fixable: "code",
    messages: {
      [ERROR_MESSAGE_ID]:
        "Prefer relative paths when importing sibling or descendent files",
    },
  },
};
