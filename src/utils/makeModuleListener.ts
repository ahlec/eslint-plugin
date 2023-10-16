import type * as ESTree from "estree";
import type { Rule } from "eslint";

interface ModuleImport {
  node: ESTree.Node;
  type: "import" | "require";
  source: string;
}

type ProcessModuleFn = (statement: ModuleImport) => void;

function makeModuleListener(
  this: void,
  process: ProcessModuleFn,
): Rule.RuleListener {
  return {
    CallExpression: (node): void => {
      if (
        node.callee.type !== "Identifier" ||
        node.callee.name !== "require" ||
        node.arguments.length !== 1 ||
        node.arguments[0].type !== "Literal" ||
        typeof node.arguments[0].value !== "string"
      ) {
        return;
      }

      process({
        node,
        type: "require",
        source: node.arguments[0].value,
      });
    },
    ImportDeclaration: (node) => {
      if (typeof node.source.value !== "string") {
        throw new Error(
          `Unexpected encounter of ${typeof node.source
            .value} in import source`,
        );
      }

      process({
        node,
        type: "import",
        source: node.source.value,
      });
    },
  };
}

export default makeModuleListener;
