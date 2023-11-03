import { orderBy } from "lodash";
import path from "path";
import type { Rule } from "eslint";
import { cleanImportPath } from "../utils/cleanImportPath";
import { isRelativePathToParent } from "../utils/fs";
import getAliases from "../utils/getAliases";
import { getContextFilename } from "../utils/getContextFilename";
import makeModuleListener from "../utils/makeModuleListener";

export const ERROR_MESSAGE_ID = "prefer-alias";

export const PreferAliasForParentImportRule: Rule.RuleModule = {
  create: (context): Rule.RuleListener => {
    const allAliases = getAliases(context.settings);
    const currentDirectory = path.dirname(getContextFilename(context));

    return makeModuleListener((statement) => {
      // This rule only applies to imports that use relative paths to
      // navigate to a parent directory
      if (!isRelativePathToParent(statement.source)) {
        return;
      }

      // Determine the absolute path being imported
      const absoluteFilepath = path.resolve(currentDirectory, statement.source);

      // Find if there are any alias(es) that match this path
      const applicableAliases = allAliases.filter((alias) =>
        alias.matchesAbsolute(absoluteFilepath),
      );

      // If there are no aliases, then this import isn't in violation of the
      // rule
      if (!applicableAliases.length) {
        return;
      }

      // Find the BEST alias. Here, we'll assume this to be the alias that
      // results in the shortest import statement
      const possibleImportPaths = applicableAliases.map((definition) =>
        cleanImportPath(definition.convertToAlias(absoluteFilepath)),
      );
      const bestImportPath = orderBy(
        possibleImportPaths,
        (possible) => possible.length,
        "asc",
      )[0];

      context.report({
        node: statement.node,
        messageId: ERROR_MESSAGE_ID,
        fix: (fixer) =>
          fixer.replaceText(statement.sourceNode, `"${bestImportPath}"`),
      });
    });
  },
  meta: {
    fixable: "code",
    messages: {
      [ERROR_MESSAGE_ID]:
        "Prefer aliases when importing from parent directories",
    },
  },
};
